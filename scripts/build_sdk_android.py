from scripting_utils import *

def build(root_dir, apptype, configuration):
    # ------------------------------------------------------------------
    # Paths.
    env_titanium_support    = get_env_variable('TITANIUM_SUPPORT_PATH')
    dir_test_module         = '{0}/test/module'.format(root_dir)
    dir_test_app            = '{0}/test/app'.format(root_dir)

    # ------------------------------------------------------------------
    # Removing example/test app from test device/emulator.
    debug_green('Removing example/test app from test device/emulator ...')
    adb_uninstall('com.adjust.examples')

    # ------------------------------------------------------------------
    # Removing SDK android module.
    debug_green('Removing SDK android module from {0} ...'.format(env_titanium_support))
    remove_dir_if_exists('{0}/modules/android/ti.adjust'.format(env_titanium_support))
    if apptype == 'test':
        remove_dir_if_exists('{0}/modules/android/ti.adjust.test'.format(env_titanium_support))

    # ------------------------------------------------------------------
    # Cleaning SDK android module project.
    debug_green('Cleaning SDK android module project ...')
    remove_dir_if_exists('{0}/android/android/build'.format(root_dir))
    remove_files('libti.*', '{0}/android/android/libs/armeabi-v7a'.format(root_dir))
    remove_files('libti.*', '{0}/android/android/libs/x86'.format(root_dir))
    if apptype == 'test':
        remove_dir_if_exists('{0}/android/android/build'.format(dir_test_module))
        remove_files('libti.*', '{0}/android/android/libs/armeabi-v7a'.format(dir_test_module))
        remove_files('libti.*', '{0}/android/android/libs/x86'.format(dir_test_module))

    # ------------------------------------------------------------------
    # Build SDK.
    _build_sdk(root_dir, configuration, apptype)

    # ------------------------------------------------------------------
    # Building SDK android module.
    debug_green('Building SDK android module ...')
    change_dir('{0}/android/android'.format(root_dir))
    appc_ti_build()
    debug_green('Extracting SDK module to ${0} ...'.format(env_titanium_support))
    ti_unzip('dist/ti.adjust*.zip')

    if apptype == 'test':
        change_dir('{0}/android/android'.format(dir_test_module))
        appc_ti_build()
        debug_green('Extracting SDK test module to ${0} ...'.format(env_titanium_support))
        ti_unzip('dist/ti.adjust.test*.zip')

def _build_sdk(root_dir, configuration, apptype):
    # ------------------------------------------------------------------
    # Paths.
    dir_build        = '{0}/ext/android/sdk/Adjust'.format(root_dir)
    dir_out_jar_sdk  = '{0}/android/android/lib'.format(root_dir)
    dir_out_jar_test = '{0}/test/module/android/android/lib'.format(root_dir)
    dir_in_jar_sdk   = '{0}/sdk-core/build/libs'.format(dir_build)
    dir_in_jar_test  = '{0}/test-library/build/libs'.format(dir_build)

    change_dir(dir_build)

    # ------------------------------------------------------------------
    # Running Gradle tasks for Android SDK.
    debug_green('Running Gradle tasks for Android SDK ...')
    if configuration == 'release':
        gradle_make_release_jar_sdk(do_clean=True)
    else:
        gradle_make_debug_jar_sdk(do_clean=True)
    copy_file('{0}/adjust-sdk-{1}.jar'.format(dir_in_jar_sdk, configuration), '{0}/adjust-android.jar'.format(dir_out_jar_sdk))

    if apptype == 'test':
        # ------------------------------------------------------------------
        # Running Gradle tasks for Android SDK test library
        debug_green('Running Gradle tasks for Android SDK test library ...')
        gradle_clean_make_jar_test()
        copy_file('{0}/test-library-debug.jar'.format(dir_in_jar_test), '{0}/adjust-test.jar'.format(dir_out_jar_test))

    debug_green('Build SDK complete.')
