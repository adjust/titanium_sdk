#!/usr/bin/python
import argparse
from scripting_utils import *
import build_sdk_android as android
import build_sdk_ios     as ios

set_log_tag('BUILD-SDK')

if __name__ != "__main__":
    error('Error. Do not import this script, but run it explicitly.')
    exit()

# ------------------------------------------------------------------
# set arguments
parser = argparse.ArgumentParser(description="Script used to build SDK or Cocos2dx")
parser.add_argument('platform', help='platform to which the scripts will be ran for', choices=['android', 'ios'])
parser.add_argument('-t', '--apptype', help='type of the application to be updated (default = example)', choices=['example', 'test'], default='example')
parser.add_argument('-c', '--configuration', help='build configuration (default = release)', choices=['release', 'debug'], default='release')

args = parser.parse_args()

# ------------------------------------------------------------------
# common paths
script_dir              = os.path.dirname(os.path.realpath(__file__))
root_dir                = os.path.dirname(os.path.normpath(script_dir))
android_submodule_dir   = '{0}/ext/android'.format(root_dir)
ios_submodule_dir       = '{0}/ext/ios'.format(root_dir)
titanium_sdk_version    = '7.4.0.GA'

# ------------------------------------------------------------------
# Setting Titanium SDK version
debug_green('Setting Titanium SDK to {0} ...'.format(titanium_sdk_version))
appc_select_sdk(titanium_sdk_version)

# ------------------------------------------------------------------
# call platform specific build method
try:
    if args.platform == 'ios':
        set_log_tag('IOS-SDK-BUILD')
        check_submodule_dir('iOS', ios_submodule_dir + '/sdk')
        ios.build(root_dir, args.apptype, args.configuration)
    else:
        set_log_tag('ANROID-SDK-BUILD')
        check_submodule_dir('Android', android_submodule_dir + '/sdk')
        android.build(root_dir, args.apptype, args.configuration)
finally:
    # remove autocreated python compiled files
    remove_files('*.pyc', script_dir, log=False)

emulated_device_str = 'emulator';
if args.platform == 'ios':
    emulated_device_str = 'simulator'
debug_green('Run from IDE or:')
if args.apptype == 'example':
    debug_green('Emulator: cd root_dir/example; appc ti build -p {0} -T {1}'.format(args.platform, emulated_device_str))
    debug_green('Device: cd root_dir/example; appc ti build -p {0} -T device'.format(args.platform))
else:
    debug_green('Emulator: cd root_dir/test/app; appc ti build -p {0} -T {1}'.format(args.platform, emulated_device_str))
    debug_green('Device: cd root_dir/test/app; appc ti build -p {0} -T device'.format(args.platform))

# ------------------------------------------------------------------
# Script completed
debug_green('Script completed!')
