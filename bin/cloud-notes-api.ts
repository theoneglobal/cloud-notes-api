#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CloudNotesApiStack } from '../lib/cloud-notes-api-stack';

const app = new cdk.App();
new CloudNotesApiStack(app, 'CloudNotesApiStack');
