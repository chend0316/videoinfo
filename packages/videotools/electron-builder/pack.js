require('dotenv').config();
const appleId = process.env.APPLEID;
const appleIdPassword = process.env.APPLEIDPASS;

const path = require('path');
const fs = require('fs/promises');

const { execFileSync } = require('child_process');
const builder = require('electron-builder');

main();

function main() {
  builder.build(
    {
      targets: builder.Platform.MAC.createTarget(),
      config: {
        appId: 'io.github.chend0316.videotools',
        directories: {
          buildResources: './electron-builder',
          output: './electron-builder-dist',
        },
        mac: {
          target: ['zip', 'pkg'],
          hardenedRuntime: true,
          category: 'public.app-category.developer-tools',
          entitlements: 'electron-builder/entitlements.mac.plist',
          entitlementsInherit: 'electron-builder/entitlements.mac.plist',
          publish: ['github'],
          extraFiles: [
            {
              from: '../videotools-daemon/dist/videotools-daemon',
              to: 'MacOS/videotools-daemon',
            }
          ],
          extraResources: [
            {
              from: './electron-builder/resources/cn.InfoPlist.strings',
              to: 'zh_CN.lproj/InfoPlist.strings',
            }
          ],
        },
        pkg: {
          scripts: './pkg-scripts',
        },
        afterPack: async (context) => {
          // console.log(context);
        },
        afterSign: async (context) => {
          // await notarizeMac(`${context.appOutDir}/${context.packager.appInfo.productFilename}.app`);
        },
        afterAllArtifactBuild: async (result) => {
          // result.artifactPaths 里面找一个 pkg 文件进行公证
          // todo: 可能会存在多个文件
          const [pkgFilepath] = result.artifactPaths.filter(filename => filename.endsWith('.pkg'));
          // pkgFilepath && await signMacPkg(pkgFilepath);
          pkgFilepath && await notarizeMac(pkgFilepath);
        }
      }
    }
  )
    .then((result) => {
      console.log('build success');
      console.log(JSON.stringify(result));
    })
    .catch((error) => {
      console.log('build failed');
      console.error(error);
    });
}

const { notarize } = require('electron-notarize');
async function notarizeMac(filepath) {
  console.log('notarize start');
  const start = new Date();
  await notarize({
    appBundleId: 'io.github.chend0316.videotools',
    appPath: filepath,
    appleId,
    appleIdPassword,
  });
  const end = new Date();
  console.log(`notarize end cost ${(end - start) / 1000}s`);
};
