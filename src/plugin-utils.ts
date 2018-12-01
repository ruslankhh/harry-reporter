import { ITestResult } from './report-builder/types';

export const getSuitePath = (suite: ITestResult): any => {
  return suite.root ? [] : [].concat(getSuitePath(suite.parent)).concat(suite.title);
};
