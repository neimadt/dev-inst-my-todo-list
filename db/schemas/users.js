import { pgTable, serial, text, date } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { assignedTos } from './assignedTos.js';


export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    createdAt: date('createdAt').defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
    assignedTo: many(assignedTos),
}));
