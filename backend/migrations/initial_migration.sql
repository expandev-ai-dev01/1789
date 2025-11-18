-- =====================================================
-- Database Migration: Stock Movement System
-- =====================================================
-- IMPORTANT: Always use [dbo] schema in this file.
-- The migration-runner will automatically replace [dbo] with [project_stockbox]
-- at runtime based on the PROJECT_ID environment variable.
-- DO NOT hardcode [project_XXX] - always use [dbo]!
-- DO NOT create schema here - migration-runner creates it programmatically.
-- =====================================================

-- =====================================================
-- TABLES
-- =====================================================

/**
 * @table stockMovement Stock movement records for inventory tracking
 * @multitenancy true
 * @softDelete false
 * @alias stmMov
 */
CREATE TABLE [dbo].[stockMovement] (
  [idStockMovement] INTEGER IDENTITY(1,1) NOT NULL,
  [idAccount] INTEGER NOT NULL,
  [idProduct] INTEGER NOT NULL,
  [idUser] INTEGER NOT NULL,
  [movementType] INTEGER NOT NULL,
  [quantity] NUMERIC(15,2) NOT NULL,
  [referenceDocument] VARCHAR(50) NULL,
  [batchNumber] VARCHAR(30) NULL,
  [expirationDate] DATE NULL,
  [location] NVARCHAR(100) NULL,
  [reason] NVARCHAR(500) NULL,
  [dateCreated] DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);
GO

/**
 * @table product Product master data
 * @multitenancy true
 * @softDelete true
 * @alias prd
 */
CREATE TABLE [dbo].[product] (
  [idProduct] INTEGER IDENTITY(1,1) NOT NULL,
  [idAccount] INTEGER NOT NULL,
  [name] NVARCHAR(100) NOT NULL,
  [code] VARCHAR(50) NOT NULL,
  [description] NVARCHAR(500) NOT NULL DEFAULT (''),
  [currentStock] NUMERIC(15,2) NOT NULL DEFAULT (0),
  [deleted] BIT NOT NULL DEFAULT (0),
  [dateCreated] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
  [dateModified] DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);
GO

-- =====================================================
-- PRIMARY KEYS
-- =====================================================

/**
 * @primaryKey pkStockMovement
 * @keyType Object
 */
ALTER TABLE [dbo].[stockMovement]
ADD CONSTRAINT [pkStockMovement] PRIMARY KEY CLUSTERED ([idStockMovement]);
GO

/**
 * @primaryKey pkProduct
 * @keyType Object
 */
ALTER TABLE [dbo].[product]
ADD CONSTRAINT [pkProduct] PRIMARY KEY CLUSTERED ([idProduct]);
GO

-- =====================================================
-- FOREIGN KEYS
-- =====================================================

/**
 * @foreignKey fkStockMovement_Product Product reference for movement
 * @target dbo.product
 */
ALTER TABLE [dbo].[stockMovement]
ADD CONSTRAINT [fkStockMovement_Product] FOREIGN KEY ([idProduct])
REFERENCES [dbo].[product]([idProduct]);
GO

-- =====================================================
-- CHECK CONSTRAINTS
-- =====================================================

/**
 * @check chkStockMovement_MovementType Movement type validation
 * @enum {0} entrada - Stock entry
 * @enum {1} saida - Stock exit
 * @enum {2} ajuste - Stock adjustment
 * @enum {3} exclusao - Product deletion
 */
ALTER TABLE [dbo].[stockMovement]
ADD CONSTRAINT [chkStockMovement_MovementType] CHECK ([movementType] BETWEEN 0 AND 3);
GO

-- =====================================================
-- INDEXES
-- =====================================================

/**
 * @index ixStockMovement_Account Account isolation index
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixStockMovement_Account]
ON [dbo].[stockMovement]([idAccount]);
GO

/**
 * @index ixStockMovement_Product Product lookup index
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixStockMovement_Product]
ON [dbo].[stockMovement]([idAccount], [idProduct]);
GO

/**
 * @index ixStockMovement_DateCreated Date-based queries
 * @type Performance
 */
CREATE NONCLUSTERED INDEX [ixStockMovement_DateCreated]
ON [dbo].[stockMovement]([idAccount], [dateCreated] DESC);
GO

/**
 * @index ixStockMovement_User User-based queries
 * @type Performance
 */
CREATE NONCLUSTERED INDEX [ixStockMovement_User]
ON [dbo].[stockMovement]([idAccount], [idUser]);
GO

/**
 * @index ixProduct_Account Account isolation index
 * @type ForeignKey
 */
CREATE NONCLUSTERED INDEX [ixProduct_Account]
ON [dbo].[product]([idAccount])
WHERE [deleted] = 0;
GO

/**
 * @index ixProduct_Code Product code lookup
 * @type Search
 */
CREATE NONCLUSTERED INDEX [ixProduct_Code]
ON [dbo].[product]([idAccount], [code])
WHERE [deleted] = 0;
GO

/**
 * @index uqProduct_Account_Code Unique product code per account
 * @type Unique
 * @unique true
 */
CREATE UNIQUE NONCLUSTERED INDEX [uqProduct_Account_Code]
ON [dbo].[product]([idAccount], [code])
WHERE [deleted] = 0;
GO

-- =====================================================
-- STORED PROCEDURES
-- =====================================================

/**
 * @summary
 * Creates a new stock movement record and updates product stock balance.
 * Validates business rules for each movement type.
 *
 * @procedure spStockMovementCreate
 * @schema dbo
 * @type stored-procedure
 *
 * @parameters
 * @param {INT} idAccount - Account identifier
 * @param {INT} idUser - User identifier
 * @param {INT} idProduct - Product identifier
 * @param {INT} movementType - Movement type (0=entrada, 1=saida, 2=ajuste, 3=exclusao)
 * @param {NUMERIC} quantity - Quantity moved
 * @param {VARCHAR} referenceDocument - Reference document number
 * @param {VARCHAR} batchNumber - Batch number
 * @param {DATE} expirationDate - Expiration date
 * @param {NVARCHAR} location - Storage location
 * @param {NVARCHAR} reason - Movement reason
 *
 * @returns {INT} idStockMovement - Created movement identifier
 */
CREATE OR ALTER PROCEDURE [dbo].[spStockMovementCreate]
  @idAccount INTEGER,
  @idUser INTEGER,
  @idProduct INTEGER,
  @movementType INTEGER,
  @quantity NUMERIC(15,2),
  @referenceDocument VARCHAR(50) = NULL,
  @batchNumber VARCHAR(30) = NULL,
  @expirationDate DATE = NULL,
  @location NVARCHAR(100) = NULL,
  @reason NVARCHAR(500) = NULL
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Required parameter validation
   * @throw {parameterRequired}
   */
  IF @idAccount IS NULL
  BEGIN
    ;THROW 51000, 'idAccountRequired', 1;
  END;

  IF @idUser IS NULL
  BEGIN
    ;THROW 51000, 'idUserRequired', 1;
  END;

  IF @idProduct IS NULL
  BEGIN
    ;THROW 51000, 'idProductRequired', 1;
  END;

  IF @movementType IS NULL
  BEGIN
    ;THROW 51000, 'movementTypeRequired', 1;
  END;

  IF @quantity IS NULL
  BEGIN
    ;THROW 51000, 'quantityRequired', 1;
  END;

  /**
   * @validation Product existence validation
   * @throw {productDoesntExist}
   */
  IF NOT EXISTS (
    SELECT 1
    FROM [dbo].[product] prd
    WHERE prd.[idProduct] = @idProduct
      AND prd.[idAccount] = @idAccount
      AND prd.[deleted] = 0
  )
  BEGIN
    ;THROW 51000, 'productDoesntExist', 1;
  END;

  /**
   * @rule {BR-003} Validate sufficient stock for exit movements
   */
  IF @movementType = 1
  BEGIN
    DECLARE @currentStock NUMERIC(15,2);
    
    SELECT @currentStock = prd.[currentStock]
    FROM [dbo].[product] prd
    WHERE prd.[idProduct] = @idProduct
      AND prd.[idAccount] = @idAccount;

    IF @currentStock < ABS(@quantity)
    BEGIN
      ;THROW 51000, 'insufficientStock', 1;
    END;
  END;

  /**
   * @rule {BR-004,BR-005} Validate reason for adjustments and deletions
   */
  IF (@movementType = 2 OR @movementType = 3) AND (@reason IS NULL OR LEN(@reason) = 0)
  BEGIN
    ;THROW 51000, 'reasonRequired', 1;
  END;

  /**
   * @rule {RU-005,RU-006,RU-007,RU-008} Validate quantity based on movement type
   */
  IF @movementType = 0 AND @quantity <= 0
  BEGIN
    ;THROW 51000, 'quantityMustBePositiveForEntry', 1;
  END;

  IF @movementType = 1 AND @quantity >= 0
  BEGIN
    ;THROW 51000, 'quantityMustBeNegativeForExit', 1;
  END;

  IF @movementType = 3 AND @quantity <> 0
  BEGIN
    ;THROW 51000, 'quantityMustBeZeroForDeletion', 1;
  END;

  /**
   * @rule {RU-015} Validate expiration date for entries
   */
  IF @movementType = 0 AND @expirationDate IS NOT NULL AND @expirationDate <= CAST(GETUTCDATE() AS DATE)
  BEGIN
    ;THROW 51000, 'expirationDateMustBeFuture', 1;
  END;

  BEGIN TRY
    BEGIN TRAN;

      /**
       * @rule {DF-009} Insert stock movement record
       */
      INSERT INTO [dbo].[stockMovement] (
        [idAccount],
        [idProduct],
        [idUser],
        [movementType],
        [quantity],
        [referenceDocument],
        [batchNumber],
        [expirationDate],
        [location],
        [reason],
        [dateCreated]
      )
      VALUES (
        @idAccount,
        @idProduct,
        @idUser,
        @movementType,
        @quantity,
        @referenceDocument,
        @batchNumber,
        @expirationDate,
        @location,
        @reason,
        GETUTCDATE()
      );

      DECLARE @idStockMovement INTEGER = SCOPE_IDENTITY();

      /**
       * @rule {DF-010,BR-011} Update product stock balance
       */
      IF @movementType <> 3
      BEGIN
        UPDATE [dbo].[product]
        SET [currentStock] = [currentStock] + @quantity,
            [dateModified] = GETUTCDATE()
        WHERE [idProduct] = @idProduct
          AND [idAccount] = @idAccount;
      END
      ELSE
      BEGIN
        /**
         * @rule {BR-005} Mark product as deleted for deletion movements
         */
        UPDATE [dbo].[product]
        SET [deleted] = 1,
            [dateModified] = GETUTCDATE()
        WHERE [idProduct] = @idProduct
          AND [idAccount] = @idAccount;
      END;

      /**
       * @output {MovementResult, 1, 1}
       * @column {INT} idStockMovement - Created movement identifier
       */
      SELECT @idStockMovement AS [idStockMovement];

    COMMIT TRAN;
  END TRY
  BEGIN CATCH
    ROLLBACK TRAN;
    THROW;
  END CATCH;
END;
GO

/**
 * @summary
 * Lists stock movements with optional filters.
 * Supports filtering by date range, product, movement type, and user.
 *
 * @procedure spStockMovementList
 * @schema dbo
 * @type stored-procedure
 *
 * @parameters
 * @param {INT} idAccount - Account identifier
 * @param {DATETIME2} startDate - Start date filter
 * @param {DATETIME2} endDate - End date filter
 * @param {INT} idProduct - Product filter
 * @param {INT} movementType - Movement type filter
 * @param {INT} idUser - User filter
 * @param {VARCHAR} orderBy - Sort order (date_asc, date_desc, product_asc, product_desc)
 * @param {INT} limitRecords - Maximum records to return
 */
CREATE OR ALTER PROCEDURE [dbo].[spStockMovementList]
  @idAccount INTEGER,
  @startDate DATETIME2 = NULL,
  @endDate DATETIME2 = NULL,
  @idProduct INTEGER = NULL,
  @movementType INTEGER = NULL,
  @idUser INTEGER = NULL,
  @orderBy VARCHAR(20) = 'date_desc',
  @limitRecords INTEGER = 100
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Required parameter validation
   * @throw {parameterRequired}
   */
  IF @idAccount IS NULL
  BEGIN
    ;THROW 51000, 'idAccountRequired', 1;
  END;

  /**
   * @validation Date range validation
   * @throw {invalidDateRange}
   */
  IF @startDate IS NOT NULL AND @endDate IS NOT NULL AND @endDate < @startDate
  BEGIN
    ;THROW 51000, 'endDateMustBeGreaterThanStartDate', 1;
  END;

  /**
   * @validation Limit validation
   * @throw {invalidLimit}
   */
  IF @limitRecords < 1 OR @limitRecords > 1000
  BEGIN
    ;THROW 51000, 'limitMustBeBetween1And1000', 1;
  END;

  /**
   * @rule {BR-007,DF-019} Query movements with filters and ordering
   * @output {MovementList, n, n}
   * @column {INT} idStockMovement - Movement identifier
   * @column {INT} idProduct - Product identifier
   * @column {NVARCHAR} productName - Product name
   * @column {VARCHAR} productCode - Product code
   * @column {INT} movementType - Movement type
   * @column {NVARCHAR} movementTypeName - Movement type description
   * @column {NUMERIC} quantity - Quantity moved
   * @column {VARCHAR} referenceDocument - Reference document
   * @column {VARCHAR} batchNumber - Batch number
   * @column {DATE} expirationDate - Expiration date
   * @column {NVARCHAR} location - Storage location
   * @column {NVARCHAR} reason - Movement reason
   * @column {INT} idUser - User identifier
   * @column {DATETIME2} dateCreated - Creation timestamp
   */
  SELECT TOP (@limitRecords)
    stmMov.[idStockMovement],
    stmMov.[idProduct],
    prd.[name] AS [productName],
    prd.[code] AS [productCode],
    stmMov.[movementType],
    CASE stmMov.[movementType]
      WHEN 0 THEN 'entrada'
      WHEN 1 THEN 'saida'
      WHEN 2 THEN 'ajuste'
      WHEN 3 THEN 'exclusao'
    END AS [movementTypeName],
    stmMov.[quantity],
    stmMov.[referenceDocument],
    stmMov.[batchNumber],
    stmMov.[expirationDate],
    stmMov.[location],
    stmMov.[reason],
    stmMov.[idUser],
    stmMov.[dateCreated]
  FROM [dbo].[stockMovement] stmMov
    JOIN [dbo].[product] prd ON (prd.[idAccount] = stmMov.[idAccount] AND prd.[idProduct] = stmMov.[idProduct])
  WHERE stmMov.[idAccount] = @idAccount
    AND (@startDate IS NULL OR stmMov.[dateCreated] >= @startDate)
    AND (@endDate IS NULL OR stmMov.[dateCreated] <= @endDate)
    AND (@idProduct IS NULL OR stmMov.[idProduct] = @idProduct)
    AND (@movementType IS NULL OR stmMov.[movementType] = @movementType)
    AND (@idUser IS NULL OR stmMov.[idUser] = @idUser)
  ORDER BY
    CASE WHEN @orderBy = 'date_asc' THEN stmMov.[dateCreated] END ASC,
    CASE WHEN @orderBy = 'date_desc' THEN stmMov.[dateCreated] END DESC,
    CASE WHEN @orderBy = 'product_asc' THEN prd.[name] END ASC,
    CASE WHEN @orderBy = 'product_desc' THEN prd.[name] END DESC;
END;
GO

/**
 * @summary
 * Calculates current stock balance for a product.
 * Returns current stock, last movement details, and product status.
 *
 * @procedure spProductStockGet
 * @schema dbo
 * @type stored-procedure
 *
 * @parameters
 * @param {INT} idAccount - Account identifier
 * @param {INT} idProduct - Product identifier
 */
CREATE OR ALTER PROCEDURE [dbo].[spProductStockGet]
  @idAccount INTEGER,
  @idProduct INTEGER
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Required parameter validation
   * @throw {parameterRequired}
   */
  IF @idAccount IS NULL
  BEGIN
    ;THROW 51000, 'idAccountRequired', 1;
  END;

  IF @idProduct IS NULL
  BEGIN
    ;THROW 51000, 'idProductRequired', 1;
  END;

  /**
   * @validation Product existence validation
   * @throw {productDoesntExist}
   */
  IF NOT EXISTS (
    SELECT 1
    FROM [dbo].[product] prd
    WHERE prd.[idProduct] = @idProduct
      AND prd.[idAccount] = @idAccount
  )
  BEGIN
    ;THROW 51000, 'productDoesntExist', 1;
  END;

  /**
   * @rule {BR-011,BR-012,BR-013} Calculate stock balance and determine status
   * @output {StockBalance, 1, n}
   * @column {INT} idProduct - Product identifier
   * @column {NVARCHAR} productName - Product name
   * @column {VARCHAR} productCode - Product code
   * @column {NUMERIC} currentStock - Current stock balance
   * @column {DATETIME2} lastMovementDate - Last movement timestamp
   * @column {INT} lastMovementType - Last movement type
   * @column {NVARCHAR} lastMovementTypeName - Last movement type description
   * @column {NVARCHAR} status - Product status (disponivel, em_falta, excluido)
   * @column {BIT} deleted - Deletion flag
   */
  SELECT
    prd.[idProduct],
    prd.[name] AS [productName],
    prd.[code] AS [productCode],
    prd.[currentStock],
    lastMov.[dateCreated] AS [lastMovementDate],
    lastMov.[movementType] AS [lastMovementType],
    CASE lastMov.[movementType]
      WHEN 0 THEN 'entrada'
      WHEN 1 THEN 'saida'
      WHEN 2 THEN 'ajuste'
      WHEN 3 THEN 'exclusao'
      ELSE NULL
    END AS [lastMovementTypeName],
    CASE
      WHEN prd.[deleted] = 1 THEN 'excluido'
      WHEN prd.[currentStock] <= 0 THEN 'em_falta'
      ELSE 'disponivel'
    END AS [status],
    prd.[deleted]
  FROM [dbo].[product] prd
    LEFT JOIN (
      SELECT TOP 1
        stmMov.[idProduct],
        stmMov.[dateCreated],
        stmMov.[movementType]
      FROM [dbo].[stockMovement] stmMov
      WHERE stmMov.[idAccount] = @idAccount
        AND stmMov.[idProduct] = @idProduct
      ORDER BY stmMov.[dateCreated] DESC
    ) lastMov ON (lastMov.[idProduct] = prd.[idProduct])
  WHERE prd.[idAccount] = @idAccount
    AND prd.[idProduct] = @idProduct;
END;
GO

/**
 * @summary
 * Retrieves complete movement history for a product.
 * Shows chronological list with running balance after each movement.
 *
 * @procedure spProductMovementHistoryList
 * @schema dbo
 * @type stored-procedure
 *
 * @parameters
 * @param {INT} idAccount - Account identifier
 * @param {INT} idProduct - Product identifier
 * @param {DATETIME2} startDate - Start date filter
 * @param {DATETIME2} endDate - End date filter
 * @param {INT} movementType - Movement type filter
 */
CREATE OR ALTER PROCEDURE [dbo].[spProductMovementHistoryList]
  @idAccount INTEGER,
  @idProduct INTEGER,
  @startDate DATETIME2 = NULL,
  @endDate DATETIME2 = NULL,
  @movementType INTEGER = NULL
AS
BEGIN
  SET NOCOUNT ON;

  /**
   * @validation Required parameter validation
   * @throw {parameterRequired}
   */
  IF @idAccount IS NULL
  BEGIN
    ;THROW 51000, 'idAccountRequired', 1;
  END;

  IF @idProduct IS NULL
  BEGIN
    ;THROW 51000, 'idProductRequired', 1;
  END;

  /**
   * @validation Product existence validation
   * @throw {productDoesntExist}
   */
  IF NOT EXISTS (
    SELECT 1
    FROM [dbo].[product] prd
    WHERE prd.[idProduct] = @idProduct
      AND prd.[idAccount] = @idAccount
  )
  BEGIN
    ;THROW 51000, 'productDoesntExist', 1;
  END;

  /**
   * @validation Date range validation
   * @throw {invalidDateRange}
   */
  IF @startDate IS NOT NULL AND @endDate IS NOT NULL AND @endDate < @startDate
  BEGIN
    ;THROW 51000, 'endDateMustBeGreaterThanStartDate', 1;
  END;

  /**
   * @rule {BR-16,BR-17} Display chronological history with running balance
   * @output {MovementHistory, n, n}
   * @column {INT} idStockMovement - Movement identifier
   * @column {INT} movementType - Movement type
   * @column {NVARCHAR} movementTypeName - Movement type description
   * @column {NUMERIC} quantity - Quantity moved
   * @column {NUMERIC} balanceAfter - Stock balance after movement
   * @column {VARCHAR} referenceDocument - Reference document
   * @column {VARCHAR} batchNumber - Batch number
   * @column {DATE} expirationDate - Expiration date
   * @column {NVARCHAR} location - Storage location
   * @column {NVARCHAR} reason - Movement reason
   * @column {INT} idUser - User identifier
   * @column {DATETIME2} dateCreated - Creation timestamp
   */
  SELECT
    stmMov.[idStockMovement],
    stmMov.[movementType],
    CASE stmMov.[movementType]
      WHEN 0 THEN 'entrada'
      WHEN 1 THEN 'saida'
      WHEN 2 THEN 'ajuste'
      WHEN 3 THEN 'exclusao'
    END AS [movementTypeName],
    stmMov.[quantity],
    SUM(stmMov2.[quantity]) AS [balanceAfter],
    stmMov.[referenceDocument],
    stmMov.[batchNumber],
    stmMov.[expirationDate],
    stmMov.[location],
    stmMov.[reason],
    stmMov.[idUser],
    stmMov.[dateCreated]
  FROM [dbo].[stockMovement] stmMov
    JOIN [dbo].[stockMovement] stmMov2 ON (
      stmMov2.[idAccount] = stmMov.[idAccount]
      AND stmMov2.[idProduct] = stmMov.[idProduct]
      AND stmMov2.[dateCreated] <= stmMov.[dateCreated]
      AND stmMov2.[movementType] <> 3
    )
  WHERE stmMov.[idAccount] = @idAccount
    AND stmMov.[idProduct] = @idProduct
    AND (@startDate IS NULL OR stmMov.[dateCreated] >= @startDate)
    AND (@endDate IS NULL OR stmMov.[dateCreated] <= @endDate)
    AND (@movementType IS NULL OR stmMov.[movementType] = @movementType)
  GROUP BY
    stmMov.[idStockMovement],
    stmMov.[movementType],
    stmMov.[quantity],
    stmMov.[referenceDocument],
    stmMov.[batchNumber],
    stmMov.[expirationDate],
    stmMov.[location],
    stmMov.[reason],
    stmMov.[idUser],
    stmMov.[dateCreated]
  ORDER BY
    stmMov.[dateCreated] ASC;
END;
GO