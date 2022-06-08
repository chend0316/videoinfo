require('dotenv').config();
const appleId = process.env.APPLEID
const appleIdPassword = process.env.APPLEIDPASS

// import builder from 'electron-builder'
const builder = require("electron-builder")

builder.build(
  {
    targets: builder.Platform.MAC.createTarget(),
    config: {
      appId: "io.github.chend0316.videotools",
      directories: {
        // buildResources: 'resources',
        output: './electron-dist',
      },
      mac: {
        // target: ['dmg', 'zip', 'pkg'],
        target: ['pkg'],
        hardenedRuntime: true,
        category: "public.app-category.developer-tools",
        entitlements: "build/entitlements.mac.plist",
        entitlementsInherit: "build/entitlements.mac.plist",
        publish: ['github'],
        extraFiles: [
          {
            from: '../videotools-daemon/dist/videotools-daemon',
            to: 'MacOS/1videotools-daemon',
          }
        ],
        extraResources: [
          {
            from: './build/resources/cn.InfoPlist.strings',
            to: 'zh_CN.lproj/InfoPlist.strings',
          }
        ],
      },
      pkg: {
        scripts: 'pkg-scripts',
      },
      afterSign: async (ctx) => {
        await notarizeMac(ctx)
      },
      afterAllArtifactBuild: (result) => {
        console.log(result.outDir)
      }
    }
  }
)
  .then((result) => {
    console.log(JSON.stringify(result))
  })
  .catch((error) => {
    console.error(error)
  })

async function signMac(context) {
  // codesign -s ZB4S9CX372 
  const { electronPlatformName, appOutDir } = context;
  if (electronPlatformName !== 'darwin') {
    return;
  }

  const appName = context.packager.appInfo.productFilename;

  return await sign({
    appPath: `${appOutDir}/${appName}.app`,
    identity: 'Developer ID Application: chend0316 (YQ3Q2H6C8E)'
  });
}

const { notarize } = require('electron-notarize');
async function notarizeMac(context) {
  if (!process.env.NEED_NOTARIZE) {
    return
  }
  const { electronPlatformName, appOutDir } = context;
  if (electronPlatformName !== 'darwin') {
    return;
  }

  const appName = context.packager.appInfo.productFilename;

  return await notarize({
    appBundleId: 'io.github.chend0316.videotools',
    appPath: `${appOutDir}/${appName}.app`,
    appleId,
    appleIdPassword,
  });
};
