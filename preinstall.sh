npm install
npm update

bower update --force
ionic setup sass
gulp

ionic plugin remove cordova-plugin-dialogs --force --save
ionic plugin remove cordova-plugin-globalization --force --save
ionic plugin remove cordova-plugin-media --force --save
ionic plugin remove cordova-plugin-file-transfer --force --save
ionic plugin remove cordova-plugin-media-capture --force --save
ionic plugin remove cordova-plugin-device-orientation --force --save
ionic plugin remove cordova-plugin-device --force --save
ionic plugin remove cordova-plugin-file --force --save
ionic plugin remove cordova-plugin-battery-status --force --save
ionic plugin remove cordova-plugin-camera --force --save
ionic plugin remove cordova-plugin-contacts --force --save
ionic plugin remove cordova-plugin-device-motion --force --save
ionic plugin remove cordova-plugin-geolocation --force --save
ionic plugin remove cordova-plugin-network-information --force --save
ionic plugin remove cordova-plugin-vibration --force --save
ionic plugin remove cordova-plugin-splashscreen --force --save
ionic plugin remove cordova-plugin-console --force --save
ionic plugin remove cordova-plugin-whitelist --force --save
ionic plugin remove cordova-plugin-statusbar --force --save
ionic plugin remove ionic-plugin-keyboard --force --save


ionic plugin add cordova-plugin-dialogs --save
ionic plugin add cordova-plugin-globalization --save
ionic plugin add cordova-plugin-media --save
ionic plugin add cordova-plugin-file-transfer --save
ionic plugin add cordova-plugin-media-capture --save
ionic plugin add cordova-plugin-device-orientation --save
ionic plugin add cordova-plugin-device --save
ionic plugin add cordova-plugin-file --save
ionic plugin add cordova-plugin-battery-status --save
ionic plugin add cordova-plugin-camera --save
ionic plugin add cordova-plugin-contacts --save
ionic plugin add cordova-plugin-device-motion --save
ionic plugin add cordova-plugin-geolocation --save
ionic plugin add cordova-plugin-network-information --save
ionic plugin add cordova-plugin-vibration --save
ionic plugin add cordova-plugin-splashscreen --save
ionic plugin add cordova-plugin-console --save
ionic plugin add cordova-plugin-whitelist --save
ionic plugin add cordova-plugin-statusbar --save
ionic plugin add ionic-plugin-keyboard --save
ionic plugin add https://github.com/whiteoctober/cordova-plugin-app-version.git

ionic platform rm android
ionic platform add android
ionic serve -cs
