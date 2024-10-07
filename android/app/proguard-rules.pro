# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:
-ignorewarnings

-keep class * {
    public private *;
}
##### React Native #####
-keep,allowobfuscation @interface **.facebook.proguard.annotations.DoNotStrip
-keep,allowobfuscation @interface **.facebook.proguard.annotations.KeepGettersAndSetters
-keep,allowobfuscation @interface **.facebook.react.bridge.ReadableType
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.jni.** { *; }

#-keep class com.facebook.imagepipeline.animated.factory.AnimatedFactoryImpl {
#  public AnimatedFactoryImpl(com.facebook.imagepipeline.bitmaps.PlatformBitmapFactory, com.facebook.imagepipeline.core.ExecutorSupplier);
#}
