// Copyright (c) Microsoft Corporation
// All rights reserved.
//
// MIT License
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
// documentation files (the "Software"), to deal in the Software without restriction, including without limitation
// the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
// to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
// BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


// module dependencies
const param = require('./parameter');
const jobConfig = require('../config/job');
const createError = require('../util/error');


const checkMinTaskNumber = (req, res, next) => {
  if ('killAllOnCompletedTaskNumber' in req.body) {
    const errorMessage = 'killAllOnCompletedTaskNumber has been obsoleted, please use minFailedTaskCount and minSucceededTaskCount instead.';
    next(createError('Bad Request', 'InvalidParametersError', errorMessage));
  }
  for (let i = 0; i < req.body.taskRoles.length; i ++) {
    const taskNumber = req.body.taskRoles[i].taskNumber;
    const minFailedTaskCount = req.body.taskRoles[i].minFailedTaskCount || 0;
    const minSucceededTaskCount = req.body.taskRoles[i].minSucceededTaskCount || 0;
    if (minFailedTaskCount > taskNumber || minSucceededTaskCount > taskNumber) {
      const errorMessage = 'minFailedTaskCount or minSucceededTaskCount should not be greater than tasks number.';
      next(createError('Bad Request', 'InvalidParametersError', errorMessage));
    }
  }
  next();
};

const submission = [
  param.validate(jobConfig.schema),
  checkMinTaskNumber,
];

const query = (req, res, next) => {
  const query = {};
  if (req.query.username) {
    query.username = req.query.username;
  }
  if (req.params.username) {
    query.username = req.params.username;
  }
  req._query = query;
  next();
};

const checkReadonly = (req, res, next) => {
  if (!('username' in req.params)) {
    return next(createError('Forbidden', 'ReadOnlyJobError', 'Job without user namespace is readonly.'));
  }
  next();
};

// module exports
module.exports = {submission, query, checkReadonly};
