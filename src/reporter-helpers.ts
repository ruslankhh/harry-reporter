import Promise from 'bluebird';
import fs from 'fs-extra';
import path from 'path';
import _ from 'lodash';

import * as utils from './server-utils';
import TestResult from './test-result/test-result';
import { IImagesInfo } from './test-result/types';

const saveAssertViewImages = (testResult: TestResult, reportPath: string) => {
  return Promise.map(testResult.assertViewResults, (assertResult: any) => {
    const { stateName } = assertResult;
    const actions = [];
    const src = assertResult.refImagePath || assertResult.refImg.path;

    if (!(assertResult instanceof Error)) {
      actions.push(utils.copyImageAsync(
        src,
        utils.getReferenceAbsolutePath(testResult, reportPath, stateName),
      ));
    }

    if (testResult.isImageDiffError(assertResult)) {
      actions.push(
        exports.saveTestCurrentImage(testResult, reportPath, stateName),
        utils.saveDiff(
          assertResult,
          utils.getDiffAbsolutePath(testResult, reportPath, stateName),
        ),
        utils.copyImageAsync(
          src,
          utils.getReferenceAbsolutePath(testResult, reportPath, stateName),
        ),
      );
    }

    if (testResult.isNoRefImageError(assertResult)) {
      actions.push(exports.saveTestCurrentImage(testResult, reportPath, stateName));
    }

    return Promise.all(actions);
  });
};

export const saveTestImages = (testResult: TestResult, reportPath: string): any => {
  if (testResult.assertViewResults) {
    return saveAssertViewImages(testResult, reportPath);
  }

  const actions = [
    utils.copyImageAsync(
      testResult.referencePath,
      utils.getReferenceAbsolutePath(testResult, reportPath),
    ),
  ];

  if (testResult.hasDiff()) {
    actions.push(
      exports.saveTestCurrentImage(testResult, reportPath),
      utils.saveDiff(
        testResult,
        utils.getDiffAbsolutePath(testResult, reportPath),
      ),
    );
  }

  return Promise.all(actions);
};

export const saveTestCurrentImage = (testResult: TestResult, reportPath: string, stateName: string) => {

  const src = stateName
    ? _.find<IImagesInfo>(testResult.assertViewResults, { stateName }).currentImagePath
    : testResult.getImagePath() || testResult.currentPath || testResult.screenshot;

  return src
    ? utils.copyImageAsync(src, utils.getCurrentAbsolutePath(testResult, reportPath, stateName))
    : Promise.resolve();
};

export const updateReferenceImage = (testResult: TestResult, reportPath: string, stateName: string) => {
  const src = testResult.actualPath
    ? path.resolve(reportPath, testResult.actualPath)
    : utils.getCurrentAbsolutePath(testResult, reportPath, stateName);

  return Promise.all([
    utils.copyImageAsync(src, testResult.getImagePath(stateName)),
    utils.copyImageAsync(src, utils.getReferenceAbsolutePath(testResult, reportPath, stateName)),
  ]);
};

export const saveBase64Screenshot = (testResult: TestResult, reportPath: string) => {
  if (!testResult.screenshot) {
    utils.logger.warn('Cannot save screenshot on reject');

    return Promise.resolve();
  }

  const destPath = utils.getCurrentAbsolutePath(testResult, reportPath);
  const screenshotBase64 = typeof testResult.screenshot === 'string' ?
    testResult.screenshot :
    testResult.screenshot.base64;

  return utils.makeDirFor(destPath)
    .then(() => fs.writeFile(
      destPath,
      Buffer.from(screenshotBase64, 'base64'),
      'base64',
    ))
    .catch((err) => console.log(err));
};
