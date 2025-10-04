import fs from 'node:fs';
import chalk from 'chalk';
import { randomUUID } from 'node:crypto';

function createID() = {
    return randomUUID();
}