ALTER TABLE products
ADD COLUMN IF NOT EXISTS barcode VARCHAR(100);

CREATE UNIQUE INDEX IF NOT EXISTS products_barcode_unique
ON products(barcode);
