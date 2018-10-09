from scripting_utils import *

def build(root_dir, apptype, configuration):
    # ------------------------------------------------------------------
    # paths
    titanium_support_path = get_env_variable('TITANIUM_SUPPORT_PATH')
    test_module_dir       = '{0}/test/module'.format(root_dir)
    test_app_dir          = '{0}/test/app'.format(root_dir)

    # ------------------------------------------------------------------
    # Removing example/test app from test device/emulator
    debug_green('Removing example/test app from test device/emulator ...')
    adb_uninstall('com.adjust.examples')

    # ------------------------------------------------------------------
    # Removing SDK android module
    debug_green('Removing SDK android module from $TITANIUM_SUPPORT_PATH ...')
    remove_dir_if_exists('{0}/modules/android/ti.adjust'.format(titanium_support_path))
    if apptype == 'test':
        remove_dir_if_exists('{0}/modules/android/ti.adjust.test'.format(titanium_support_path))

    # ------------------------------------------------------------------
    # Cleaning SDK android module project
    debug_green('Cleaning SDK android module project ...')
    remove_dir_if_exists('{0}/android/android/build'.format(root_dir))
    remove_files('libti.*', '{0}/android/android/libs/armeabi-v7a'.format(root_dir))
    remove_files('libti.*', '{0}/android/android/libs/x86'.format(root_dir))
    if apptype == 'test':
        remove_dir_if_exists('{0}/android/android/build'.format(test_module_dir))
        remove_files('libti.*', '{0}/android/android/libs/armeabi-v7a'.format(test_module_dir))
        remove_files('libti.*', '{0}/android/android/libs/x86'.format(test_module_dir))

    # ------------------------------------------------------------------
    # build sdk
    _build_sdk(root_dir, configuration, apptype)

    # ------------------------------------------------------------------
    # Building SDK android module
    debug_green('Building SDK android module ...')
    change_dir('{0}/android/android'.format(root_dir))
    appc_ti_build()
    # Extracting SDK module to ${TITANIUM_SUPPORT_PATH}
    ti_unzip('dist/ti.adjust*.zip')
    if apptype == 'test':
        change_dir('{0}/android/android'.format(test_module_dir))
        appc_ti_build()
        # Extracting SDK module to ${TITANIUM_SUPPORT_PATH}
        ti_unzip('dist/ti.adjust.test*.zip')

def _build_sdk(root_dir, configuration, apptype):
    # ------------------------------------------------------------------
    # paths
    build_dir        = '{0}/ext/android/sdk/Adjust'.format(root_dir)
    jar_out_dir_sdk  = '{0}/android/android/lib'.format(root_dir)
    jar_out_dir_test = '{0}/test/module/android/android/lib'.format(root_dir)
    jar_in_dir_sdk   = '{0}/adjust/build/intermediates/bundles/{1}'.format(build_dir, configuration)
    jar_in_dir_test  = '{0}/testlibrary/build/intermediates/bundles/{1}'.format(build_dir, configuration)

    change_dir(build_dir)

    # ------------------------------------------------------------------
    # Running clean and make jar Gradle tasks for Adjust SDK project
    debug_green('Running clean and make JAR Gradle tasks for Adjust SDK project ...')
    if configuration == 'release':
        gradle_make_release_jar(do_clean=True)
    else:
        gradle_make_debug_jar(do_clean=True)

    copy_file('{0}/classes.jar'.format(jar_in_dir_sdk), '{0}/adjust-android.jar'.format(jar_out_dir_sdk))

    if apptype == 'test':
        # ------------------------------------------------------------------
        # Running clean and make jar Gradle tasks for Adjust SDK project
        debug_green('Running clean and make JAR Gradle tasks for Adjust test library project ...')
        gradle_clean_make_jar()

        copy_file('{0}/classes.jar'.format(jar_in_dir_test), '{0}/adjust-testing.jar'.format(jar_out_dir_test))

    debug_green('Build SDK complete.')
