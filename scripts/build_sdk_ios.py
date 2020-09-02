from scripting_utils import *

def build(root_dir, apptype, configuration):
    # ------------------------------------------------------------------
    # Paths.
    env_titanium_support    = get_env_variable('TITANIUM_SUPPORT_PATH')
    dir_test_module         = '{0}/test/module'.format(root_dir)
    dir_test_app            = '{0}/test/app'.format(root_dir)

    # ------------------------------------------------------------------
    # Removing SDK ios module.
    debug_green('Removing SDK ios module from {0} ...'.format(env_titanium_support))
    remove_dir_if_exists('{0}/modules/iphone/ti.adjust'.format(env_titanium_support))
    if apptype == 'test':
        remove_dir_if_exists('{0}/modules/iphone/ti.adjust.test'.format(env_titanium_support))

    # ------------------------------------------------------------------
    # Cleaning SDK ios module project.
    debug_green('Cleaning SDK ios module project ...')
    remove_dir_if_exists('{0}/ios/ios/build'.format(root_dir))
    if apptype == 'test':
        remove_dir_if_exists('{0}/ios/ios/build'.format(dir_test_module))

    # ------------------------------------------------------------------
    # Build SDK.
    _build_sdk(root_dir, configuration, apptype)

    # ------------------------------------------------------------------
    # Building SDK iOS module
    debug_green('Building SDK iOS module ...')
    change_dir('{0}/ios/ios'.format(root_dir))
    appc_ti_build()
    # Extracting SDK module to ${TITANIUM_SUPPORT_PATH}
    ti_unzip('dist/ti.adjust*.zip')
    if apptype == 'test':
        change_dir('{0}/ios/ios'.format(dir_test_module))
        appc_ti_build()
        # Extracting SDK module to ${TITANIUM_SUPPORT_PATH}
        ti_unzip('dist/ti.adjust.test*.zip')
    
def _build_sdk(root_dir, configuration, apptype):
    # ------------------------------------------------------------------
    # Paths.
    dir_build_sdk  = '{0}/ext/ios/sdk'.format(root_dir)
    dir_build_test = '{0}/ext/ios/sdk/AdjustTests/AdjustTestLibrary'.format(root_dir)
    dir_out_sdk    = '{0}/ios/ios/platform'.format(root_dir)
    dir_out_test   = '{0}/test/module/ios/ios/platform'.format(root_dir)

    remove_dir_if_exists('{0}/AdjustSdk.framework'.format(dir_out_sdk))
    remove_dir_if_exists('{0}/Frameworks/Static/AdjustSdk.framework'.format(dir_build_sdk))
    if apptype == 'test':
        remove_dir_if_exists('{0}/AdjustTestLibrary.framework'.format(dir_out_test))
        remove_dir_if_exists('{0}/Frameworks/Static/AdjustTestLibrary.framework'.format(dir_build_sdk))

    # ------------------------------------------------------------------
    # Rebuilding framework files.
    debug_green('Rebuilding AdjustSdk.framework file ...')
    change_dir(dir_build_sdk)
    if configuration == 'debug':
        xcode_clean_build('AdjustStatic', 'Debug')
    else:
        xcode_clean_build('AdjustStatic', 'Release')

    if apptype == 'test':
        debug_green('Rebuilding AdjustTestLibrary.framework file ...')
        change_dir(dir_build_test)
        xcode_clean_build('AdjustTestLibraryStatic', 'Debug')

    copy_dir_contents('{0}/Frameworks/Static/AdjustSdk.framework'.format(dir_build_sdk), '{0}/AdjustSdk.framework'.format(dir_out_sdk))
    remove_dir_if_exists('{0}/AdjustSdk.framework/Versions'.format(dir_out_sdk))
    if apptype == 'test':
        copy_dir_contents('{0}/Frameworks/Static/AdjustTestLibrary.framework'.format(dir_build_sdk), '{0}/AdjustTestLibrary.framework'.format(dir_out_test))
        remove_dir_if_exists('{0}/AdjustTestLibrary.framework/Versions'.format(dir_out_test))
