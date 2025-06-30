package com.eximhrms

import android.provider.Settings
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

class DeveloperOptionsModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "DeveloperOptions"
    }

    @ReactMethod
    fun isDeveloperOptionsEnabled(promise: Promise) {
        try {
            val setting = Settings.Global.getInt(
                reactApplicationContext.contentResolver,
                Settings.Global.DEVELOPMENT_SETTINGS_ENABLED,
                0
            )
            promise.resolve(setting == 1)
        } catch (e: Exception) {
            promise.reject("ERROR", e)
        }
    }
}
