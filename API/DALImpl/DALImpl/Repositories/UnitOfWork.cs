using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Data.SqlClient;
using DAL.Contracts;
using DAL.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Logging;

namespace DALImpl.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {

        private readonly DbContext _dbContext;
        private readonly ILogger _logHelper;
        private IDbContextTransaction _transaction;

        internal DbContext CurrentDbContext => _dbContext;


        private readonly ConcurrentDictionary<Type, object> _repos = new ConcurrentDictionary<Type, object>();
        private readonly int _fastInsertBatchSize;
        private readonly string _connectionString;


        public UnitOfWork(ILoggerFactory loggerFactory, DbContext dbContext)
        {
            _dbContext = dbContext;
            _connectionString = "TODO"; //TODO
            _fastInsertBatchSize = 50;
            _logHelper = loggerFactory.CreateLogger(nameof(UnitOfWork));
        }

        public IRepository<T> GetRepository<T>() where T : class, IEntity<int>
        {
            var repo = _repos.GetOrAdd(typeof(T), type => new Repository<T>(CurrentDbContext));
            return (IRepository<T>)repo;
        }
        
        public int ExecuteNonQuery(string sql)
        {
            var res = CurrentDbContext.Database.ExecuteSqlCommand(sql);
            return res;
        }

        

        public void SaveChanges()
        {
            CurrentDbContext.SaveChanges();
        }

        #region Bulk Insert

        public void BulkInsert<T>(List<T> items) where T : class
        {
            BulkInsertResults(items, typeof(T).Name);
        }

        private void BulkInsertResults<T>(List<T> results, string table)
        {
            try
            {
                var message = $"Building {table} bulk copy table ({results.Count} records).";
                _logHelper.LogInformation(message);

                var dt = ToDataTable(results);
                message = $"{table} bulk copy table created.";
                _logHelper.LogInformation(message);

                using (var sqlConnection = new SqlConnection(_connectionString))
                {
                    sqlConnection.Open();
                    using (var sqlBulkCopy = new SqlBulkCopy(sqlConnection))
                    {
                        sqlBulkCopy.DestinationTableName = table;

                        MapColumns(sqlBulkCopy, table);

                        sqlBulkCopy.BatchSize = _fastInsertBatchSize;
                        sqlBulkCopy.WriteToServer(dt);
                    }
                }

                message = $"{table} data inserted: {results.Count} record(s).";
                _logHelper.LogInformation(message);
            }
            catch (Exception ex)
            {
                var message = $"Failed to insert {table}. Please contact your database administrator with the error message: {ex.Message}";
                _logHelper.LogError(message + Environment.NewLine + ex);
                throw;
            }
        }

        private DataTable ToDataTable<T>(IEnumerable<T> data)
        {
            var properties =
                TypeDescriptor.GetProperties(typeof(T));
            var table = new DataTable();
            foreach (PropertyDescriptor prop in properties)
                table.Columns.Add(prop.Name, Nullable.GetUnderlyingType(prop.PropertyType) ?? prop.PropertyType);
            foreach (var item in data)
            {
                var row = table.NewRow();
                foreach (PropertyDescriptor prop in properties)
                    row[prop.Name] = prop.GetValue(item) ?? DBNull.Value;
                table.Rows.Add(row);
            }
            return table;
        }

        private void MapColumns(SqlBulkCopy sqlBulkCopy, string tableName)
        {
            var columns = GetColumns(tableName);
            foreach (var column in columns)
            {
                var source = column;
                if (source.Contains(" "))
                {
                    source = source.Replace(" ", "_");
                }
                sqlBulkCopy.ColumnMappings.Add(new SqlBulkCopyColumnMapping(source, column));
            }
        }
        private IEnumerable<string> GetColumns(string tableName)
        {
            using (var sqlConnection = new SqlConnection(_connectionString))
            {
                sqlConnection.Open();
                using (var sqlCommand = new SqlCommand(
                    $"SELECT c.name FROM sys.columns c WHERE c.object_id = OBJECT_ID('{tableName}')",
                    sqlConnection))
                {
                    using (var sqlDataReader = sqlCommand.ExecuteReader())
                    {
                        var columns = new List<string>();

                        if (sqlDataReader.HasRows)
                        {
                            while (sqlDataReader.Read())
                            {
                                columns.Add(sqlDataReader.GetString(0));
                            }
                        }

                        return columns;
                    }
                }
            }
        }
        

        #endregion

        #region Transaction

        public void BeginTransaction()
        {
            if (_transaction != null)
                throw new InvalidOperationException("Transaction already exist");

            _transaction = CurrentDbContext.Database.BeginTransaction();
        }

        public void CommitTransaction()
        {
            if (_transaction == null)
                throw new InvalidOperationException("Transaction not found");

            _transaction.Commit();
            _transaction = null;
        }

        public void RollbackTransaction()
        {
            if (_transaction == null)
                throw new InvalidOperationException("Transaction not found");

            _transaction.Rollback();
            _transaction = null;
        }


        #endregion
        

        public void Dispose()
        {
            _dbContext?.Dispose();
        }
        
    }
}