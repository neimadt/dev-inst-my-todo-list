CREATE TABLE IF NOT EXISTS "assignedTos" (
	"id" serial PRIMARY KEY NOT NULL,
	"todoId" integer NOT NULL,
	"userId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "todoNotes" (
	"id" serial PRIMARY KEY NOT NULL,
	"todoId" integer NOT NULL,
	"value" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "todos" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"desc" varchar(256),
	"createdAt" date DEFAULT now() NOT NULL,
	"done" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"createdAt" date DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "assignedTos" ADD CONSTRAINT "assignedTos_todoId_todos_id_fk" FOREIGN KEY ("todoId") REFERENCES "todos"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "assignedTos" ADD CONSTRAINT "assignedTos_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "todoNotes" ADD CONSTRAINT "todoNotes_todoId_todos_id_fk" FOREIGN KEY ("todoId") REFERENCES "todos"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
