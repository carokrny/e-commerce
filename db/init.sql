CREATE TYPE "card_types" AS ENUM (
  'credit',
  'debit'
);

CREATE TYPE "order_status" AS ENUM (
  'pending',
  'shipped',
  'delivered',
  'canceled'
);

CREATE TYPE "categories" AS ENUM (
  'tops',
  'bottoms'
);

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "pw_hash" varchar(128) NOT NULL,
  "pw_salt" varchar(64) NOT NULL,
  "email" varchar(50) UNIQUE NOT NULL,
  "first_name" varchar(30),
  "last_name" varchar(30),
  "primary_address_id" int,
  "primary_payment_id" int,
  "created" timestamp NOT NULL DEFAULT (now()),
  "modified" timestamp NOT NULL DEFAULT (now())
);

CREATE TABLE "addresses" (
  "id" SERIAL PRIMARY KEY,
  "user_id" int NOT NULL,
  "first_name" varchar(30),
  "last_name" varchar(30),
  "address1" varchar(20) NOT NULL,
  "address2" varchar(20),
  "city" varchar(20) NOT NULL,
  "state" varchar(2) NOT NULL,
  "zip" varchar(10) NOT NULL,
  "country" varchar(50) NOT NULL,
  "created" timestamp NOT NULL DEFAULT (now()),
  "modified" timestamp NOT NULL DEFAULT (now())
);

CREATE TABLE "cards" (
  "id" SERIAL PRIMARY KEY,
  "user_id" int NOT NULL,
  "card_type" card_types NOT NULL DEFAULT ('credit'),
  "provider" varchar(20) NOT NULL,
  "card_no" varchar(16) NOT NULL,
  "cvv" varchar(3) NOT NULL,
  "exp_month" int NOT NULL,
  "exp_year" int NOT NULL,
  "billing_address_id" int NOT NULL,
  "created" timestamp NOT NULL DEFAULT (now()),
  "modified" timestamp NOT NULL DEFAULT (now())
);

CREATE TABLE "orders" (
  "id" SERIAL PRIMARY KEY,
  "user_id" int NOT NULL,
  "status" order_status NOT NULL DEFAULT ('pending'),
  "shipping_address_id" int NOT NULL,
  "billing_address_id" int NOT NULL,
  "payment_id" int NOT NULL,
  "stripe_charge_id" int NOT NULL,
  "amount_charged" numeric NOT NULL,
  "created" timestamp NOT NULL DEFAULT (now()),
  "modified" timestamp NOT NULL DEFAULT (now())
);

CREATE TABLE "order_items" (
  "order_id" int NOT NULL,
  "product_id" int NOT NULL,
  "quantity" int NOT NULL DEFAULT 1,
  "created" timestamp NOT NULL DEFAULT (now()),
  "modified" timestamp NOT NULL DEFAULT (now()),
  PRIMARY KEY ("order_id", "product_id")
);

CREATE TABLE "products" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar NOT NULL,
  "price" numeric NOT NULL,
  "description" text NOT NULL,
  "category" categories NOT NULL,
  "in_stock" boolean NOT NULL DEFAULT 'false',
  "created" timestamp NOT NULL DEFAULT (now()),
  "modified" timestamp NOT NULL DEFAULT (now())
);

CREATE TABLE "carts" (
  "id" SERIAL PRIMARY KEY,
  "user_id" int UNIQUE,
  "created" timestamp NOT NULL DEFAULT (now()),
  "modified" timestamp NOT NULL DEFAULT (now())
);

CREATE TABLE "cart_items" (
  "cart_id" int NOT NULL,
  "product_id" int NOT NULL,
  "quantity" int NOT NULL DEFAULT 1,
  "created" timestamp NOT NULL DEFAULT (now()),
  "modified" timestamp NOT NULL DEFAULT (now()),
  PRIMARY KEY("cart_id", "product_id")
);

CREATE TABLE "session" (
  "sid" varchar PRIMARY KEY,
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
);

ALTER TABLE "users" ADD FOREIGN KEY ("primary_address_id") REFERENCES "addresses" ("id");

ALTER TABLE "users" ADD FOREIGN KEY ("primary_payment_id") REFERENCES "cards" ("id");

ALTER TABLE "addresses" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "cards" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "cards" ADD FOREIGN KEY ("billing_address_id") REFERENCES "addresses" ("id");

ALTER TABLE "orders" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "orders" ADD FOREIGN KEY ("shipping_address_id") REFERENCES "addresses" ("id");

ALTER TABLE "orders" ADD FOREIGN KEY ("billing_address_id") REFERENCES "addresses" ("id");

ALTER TABLE "orders" ADD FOREIGN KEY ("payment_id") REFERENCES "cards" ("id");

ALTER TABLE "order_items" ADD FOREIGN KEY ("order_id") REFERENCES "orders" ("id");

ALTER TABLE "order_items" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");

ALTER TABLE "carts" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "cart_items" ADD FOREIGN KEY ("cart_id") REFERENCES "carts" ("id");

ALTER TABLE "cart_items" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");
