from scripting_utils import *

def build(root_dir, apptype, configuration):
    # ------------------------------------------------------------------
    # paths
    titanium_support_path = get_env_variable('TITANIUM_SUPPORT_PATH')
    test_module_dir       = '{0}/test/module'.format(root_dir)
    test_app_dir          = '{0}/test/app'.format(root_dir)

    # ------------------------------------------------------------------
    # Removing SDK ios module
    debug_green('Removing SDK ios module from $TITANIUM_SUPPORT_PATH ...')
    remove_dir_if_exists('{0}/modules/iphone/ti.adjust'.format(titanium_support_path))
    if apptype == 'test':
        remove_dir_if_exists('{0}/modules/iphone/ti.adjust.test'.format(titanium_support_path))

    # ------------------------------------------------------------------
    # Cleaning SDK ios module project
    debug_green('Cleaning SDK ios module project ...')
    remove_dir_if_exists('{0}/ios/ios/build'.format(root_dir))
    if apptype == 'test':
        remove_dir_if_exists('{0}/ios/ios/build'.format(test_module_dir))

    # ------------------------------------------------------------------
    # build sdk
    _build_sdk(root_dir, configuration, apptype)

    # ------------------------------------------------------------------
    # Building SDK iOS module
    debug_green('Building SDK iOS module ...')
    change_dir('{0}/ios/ios'.format(root_dir))
    appc_ti_build()
    # Extracting SDK module to ${TITANIUM_SUPPORT_PATH}
    ti_unzip('dist/ti.adjust*.zip')
    if apptype == 'test':
        change_dir('{0}/ios/ios'.format(test_module_dir))
        appc_ti_build()
        # Extracting SDK module to ${TITANIUM_SUPPORT_PATH}
        ti_unzip('dist/ti.adjust.test*.zip')
    
def _build_sdk(root_dir, configuration, apptype):
    # ------------------------------------------------------------------
    # paths]
    build_dir_sdk  = '{0}/ext/ios/sdk'.format(root_dir)
    build_dir_test = '{0}/ext/ios/sdk/AdjustTests/AdjustTestLibrary'.format(root_dir)
    out_dir_sdk    = '{0}/ios/ios/platform'.format(root_dir)
    out_dir_test   = '{0}/test/module/ios/ios/platform'.format(root_dir)

    remove_dir_if_exists('{0}/AdjustSdk.framework'.format(out_dir_sdk))
    remove_dir_if_exists('{0}/Frameworks/Static/AdjustSdk.framework'.format(build_dir_sdk))
    if apptype == 'test':
        remove_dir_if_exists('{0}/AdjustTestLibrary.framework'.format(out_dir_test))
        remove_dir_if_exists('{0}/Frameworks/Static/AdjustTestLibrary.framework'.format(build_dir_test))

    # ------------------------------------------------------------------
    # Rebuilding framework file
    debug_green('Rebuilding framework file ...')
    change_dir(build_dir_sdk)
    xcode_clean_build('AdjustStatic', configuration)
    if apptype == 'test':
        change_dir(build_dir_test)
        xcode_clean_build('AdjustTestLibraryStatic', configuration)

    copy_dir_contents('{0}/Frameworks/Static/AdjustSdk.framework'.format(build_dir_sdk), '{0}/AdjustSdk.framework'.format(out_dir_sdk))
    remove_dir_if_exists('{0}/AdjustSdk.framework/Versions'.format(out_dir_sdk))
    if apptype == 'test':
        copy_dir_contents('{0}/Frameworks/Static/AdjustTestLibrary.framework'.format(build_dir_sdk), '{0}/AdjustTestLibrary.framework'.format(out_dir_test))
        remove_dir_if_exists('{0}/AdjustTestLibrary.framework/Versions'.format(out_dir_test))
