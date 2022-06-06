require('dotenv').config();
const appleId = process.env.APPLEID
const appleIdPassword = process.env.APPLEIDPASS

// import builder from 'electron-builder'
const builder = require("electron-builder")

builder.build(
  {
    targets: builder.Platform.MAC.createTarget(),
    config: {
      appId: "io.github.chend0316.videoinfo",
      mac: {
        target: ['dmg', 'zip', 'pkg'],
        // target: ['dmg'],
        hardenedRuntime: true,
        category: "public.app-category.developer-tools",
        entitlements: "build/entitlements.mac.plist",
        entitlementsInherit: "build/entitlements.mac.plist",
        publish: ['github'],
        extraFiles: [
          {
            from: './packages/videoinfo-daemon/dist/videoinfo-daemon',
            to: 'MacOS/1videoinfo-daemon',
          }
        ],
        extraResources: [
          {
            from: './build/resources/cn.InfoPlist.strings',
            to: 'zh_CN.lproj/InfoPlist.strings',
          }
        ]
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
    appBundleId: 'io.github.chend0316.videoinfo',
    appPath: `${appOutDir}/${appName}.app`,
    appleId,
    appleIdPassword,
  });
};
