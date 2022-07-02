require('dotenv').config();
const appleId = process.env.APPLEID;
const appleIdPassword = process.env.APPLEIDPASS;

const { version: buildVersion, productName } = require('../package.json');

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
          // buildResources: 'resources',
          output: './my-builder-dist',
        },
        mac: {
          target: ['zip'],
          identity: null, // identity: 'Dong Chen (8AR5786SPE)',
          hardenedRuntime: true,
          category: 'public.app-category.developer-tools',
          entitlements: 'my-builder/entitlements.mac.plist',
          entitlementsInherit: 'my-builder/entitlements.mac.plist',
          extraFiles: [
            {
              from: '../videotools-daemon/dist/videotools-daemon',
              to: 'MacOS/videotools-daemon',
            }
          ],
          extraResources: [
            {
              from: './my-builder/resources/cn.InfoPlist.strings',
              to: 'zh_CN.lproj/InfoPlist.strings',
            }
          ],
        },
        afterPack: async (context) => { },
        afterSign: async (context) => {
          // const filepath = `${context.appOutDir}/${context.packager.appInfo.productFilename}.app`;
          // await signMacApp2(filepath);
          // await notarizeMac(filepath);
        },
        afterAllArtifactBuild: async (result) => {
          // let files = await fs.readdir(path.join(result.outDir, 'mac'));
          // const [appFilepath] = files.filter(filename => filename.endsWith('.app'));
          // if (appFilepath) {
          //   await signMacApp2(path.join(result.outDir, 'mac', appFilepath));
          // }
          await buildPkg(result.outDir, {
            bundleId: result.configuration.appId,
            productName,
            buildVersion,
          });

          let files = await fs.readdir(result.outDir);
          const [pkgFilepath] = files.filter(filename => filename.endsWith('.pkg'));
          if (pkgFilepath) {
            await notarizeMac(path.join(result.outDir, pkgFilepath));
          }
        }
      }
    }
  )
    .then((result) => {
      console.log(JSON.stringify(result));
    })
    .catch((error) => {
      console.error(error);
    });
}

async function signMacApp2(filepath) {
  const { signAsync } = require('electron-osx-sign');
  await signAsync({
    app: filepath,
    identity: 'Developer ID Application: Dong Chen (8AR5786SPE)',
    entitlements: path.join(__dirname, 'entitlements.mac.plist')
  });
}

async function signMacApp(filepath) {
  const signResult = execFileSync('codesign', [
    '--sign', 'Developer ID Application: Dong Chen (8AR5786SPE)',
    '--deep', '--timestamp',
    '--options', 'runtime',
    '--entitlements', path.join(__dirname, './entitlements.mac.plist'),
    filepath
  ], { cwd: path.join(__dirname, '../electron-dist') });
  console.log(`sign ${filepath} result:`);
  console.log(signResult.toString());
}

async function notarizeMac(filepath) {
  const { notarize } = require('electron-notarize');
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

async function buildPkg(outDir, { productName, buildVersion, bundleId }) {
  // const appName = context.packager.appInfo.productFilename;
  // const appPath = path.join(context.appOutDir, `${appName}.app`);

  const tmpPkgPath = path.join(outDir, `${bundleId}.pkg`);
  const pkgPath = path.join(outDir, `${productName}-${buildVersion}.pkg`);

  const pkgbuildResult = execFileSync('pkgbuild', [
    '--root', path.join(outDir, 'mac'),
    '--component-plist', path.join(__dirname, './videotools.plist'),
    '--install-location', '/Applications',
    '--scripts', path.join(__dirname, 'pkg-scripts'),
    tmpPkgPath
  ], { cwd: path.join(__dirname, '../my-builder-dist') });
  console.log('pkgbuild result:');
  console.log(pkgbuildResult.toString());

  const distributionFilePath = path.join(__dirname, '../my-builder-dist', 'distribution.xml');
  execFileSync('productbuild', [
    '--synthesize', '--component', path.join(outDir, 'mac', `${productName}.app`), distributionFilePath
  ], { cwd: path.join(__dirname, '../my-builder-dist') });
  let distributionFileContent = await fs.readFile(distributionFilePath, { encoding: 'utf-8' });
  distributionFileContent = distributionFileContent.replace('</installer-gui-script>', `
    <welcome file="welcome.html" />
    <readme file="readme.html" />
    <domains enable_anywhere="true" enable_currentUserHome="true" enable_localSystem="true" />
</installer-gui-script>
`);
  await fs.writeFile(distributionFilePath, distributionFileContent, { encoding: 'utf-8' });

  const productbuildResult = execFileSync('productbuild', [
    '--distribution', distributionFilePath,
    '--resources', path.join(__dirname, './distribution-resources'),
    '--sign', 'Developer ID Installer: Dong Chen (8AR5786SPE)',
    pkgPath
  ], { cwd: path.join(__dirname, '../my-builder-dist') });
  console.log('productbuild result:');
  console.log(productbuildResult.toString());

  // await fs.unlink(path.join(outDir, 'tmp.pkg'));
  await fs.unlink(tmpPkgPath);
}


function genComponentPlistFile(distFilePath, bundleId) {

}

function genDistributionFile(distFilePath, componentPath) {

}
