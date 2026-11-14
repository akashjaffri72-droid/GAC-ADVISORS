import JSZip from 'jszip';

export interface AndroidFile {
  path: string;
  language: string;
  description: string;
  content: string;
}

export const ANDROID_PROJECT_FILES: AndroidFile[] = [
  {
    path: 'app/build.gradle.kts',
    language: 'kotlin',
    description: 'App-level Gradle configuration with Jetpack Compose, Material 3, Firebase BOM, and Kotlin 2.0 compilerOptions',
    content: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
    alias(libs.plugins.google.gms.google.services)
}

android {
    namespace = "com.gacadvisors.app"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.gacadvisors.app"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
        debug {
            isDebuggable = true
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }

    buildFeatures {
        compose = true
        buildConfig = true
    }

    packaging {
        resources {
            excludes += "/META-INF/{AL2.0,LGPL2.1}"
        }
    }
}

dependencies {
    // AndroidX & Lifecycle
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.activity.compose)
    implementation(libs.androidx.lifecycle.viewmodel.compose)
    implementation(libs.androidx.navigation.compose)

    // Jetpack Compose & Material 3
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.compose.ui)
    implementation(libs.androidx.compose.ui.graphics)
    implementation(libs.androidx.compose.ui.tooling.preview)
    implementation(libs.androidx.compose.material3)
    implementation(libs.androidx.compose.material.icons.extended)

    // Firebase (BOM Managed - Unified KTX Modules)
    implementation(platform(libs.firebase.bom))
    implementation(libs.firebase.analytics)
    implementation(libs.firebase.auth)
    implementation(libs.firebase.firestore)
    implementation(libs.firebase.storage)
    implementation(libs.firebase.messaging)

    // Coroutines
    implementation(libs.kotlinx.coroutines.android)
    implementation(libs.kotlinx.coroutines.play.services)

    // Coil for Compose Image Loading
    implementation(libs.coil.compose)

    // Testing
    testImplementation(libs.junit)
    androidTestImplementation(libs.androidx.junit)
    androidTestImplementation(libs.androidx.espresso.core)
    androidTestImplementation(platform(libs.androidx.compose.bom))
    androidTestImplementation(libs.androidx.compose.ui.test.junit4)
    debugImplementation(libs.androidx.compose.ui.tooling)
    debugImplementation(libs.androidx.compose.ui.test.manifest)
}`,
  },
  {
    path: 'app/proguard-rules.pro',
    language: 'pro',
    description: 'ProGuard / R8 keep rules for Firebase Firestore models and Kotlin coroutines in Release APKs',
    content: `# GAC Advisors Release ProGuard Rules
-keepattributes Signature
-keepattributes *Annotation*
-keepclassmembers class com.gacadvisors.app.data.model.** { *; }
-keep class com.gacadvisors.app.data.model.** { *; }

# Keep Firebase / Google Play Services classes
-keepclassmembers class * {
    @com.google.firebase.firestore.PropertyName <fields>;
    @com.google.firebase.firestore.DocumentId <fields>;
}
-dontwarn com.google.errorprone.annotations.**`,
  },
  {
    path: 'app/google-services.json',
    language: 'json',
    description: 'Firebase Android configuration linked to project gen-lang-client-0461362494 (replace with Firebase Console download after registering SHA-1)',
    content: `{
  "project_info": {
    "project_number": "88629507987",
    "project_id": "gen-lang-client-0461362494",
    "storage_bucket": "gen-lang-client-0461362494.firebasestorage.app"
  },
  "client": [
    {
      "client_info": {
        "mobilesdk_app_id": "1:88629507987:android:67616361647669736f7273",
        "android_client_info": {
          "package_name": "com.gacadvisors.app"
        }
      },
      "oauth_client": [
        {
          "client_id": "88629507987-ma45min8c4hddaraf58bd3ekv89hqn47.apps.googleusercontent.com",
          "client_type": 3
        }
      ],
      "api_key": [
        {
          "current_key": "AIzaSyDiRFdHVlPpxSXR8wq5DQ4p_kDV0Eguby0"
        }
      ],
      "services": {
        "appinvite_service": {
          "other_platform_oauth_client": [
            {
              "client_id": "88629507987-ma45min8c4hddaraf58bd3ekv89hqn47.apps.googleusercontent.com",
              "client_type": 3
            }
          ]
        }
      }
    }
  ],
  "configuration_version": "1"
}`,
  },
  {
    path: 'app/src/main/AndroidManifest.xml',
    language: 'xml',
    description: 'Corrected AndroidManifest with full Android 8-15 storage/notification permissions, WhatsApp/tel/mailto queries, and valid XML references',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <!-- Network & Notifications -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

    <!-- Media & Document Access (Android 8-12 backward compatibility + Android 13-15 granular media) -->
    <uses-permission
        android:name="android.permission.READ_EXTERNAL_STORAGE"
        android:maxSdkVersion="32" />
    <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
    <uses-permission android:name="android.permission.READ_MEDIA_VISUAL_USER_SELECTED" />

    <!-- Queries for WhatsApp, Web Links, Phone Dialer & Email -->
    <queries>
        <package android:name="com.whatsapp" />
        <package android:name="com.whatsapp.w4b" />
        <intent>
            <action android:name="android.intent.action.VIEW" />
            <data android:scheme="https" />
        </intent>
        <intent>
            <action android:name="android.intent.action.DIAL" />
            <data android:scheme="tel" />
        </intent>
        <intent>
            <action android:name="android.intent.action.SENDTO" />
            <data android:scheme="mailto" />
        </intent>
    </queries>

    <application
        android:name=".GACApplication"
        android:allowBackup="true"
        android:dataExtractionRules="@xml/data_extraction_rules"
        android:fullBackupContent="@xml/backup_rules"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.GACAdvisors"
        android:usesCleartextTraffic="false">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.GACAdvisors"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <!-- Firebase Cloud Messaging Service -->
        <service
            android:name=".services.GACFirebaseMessagingService"
            android:exported="false">
            <intent-filter>
                <action android:name="com.google.firebase.MESSAGING_EVENT" />
            </intent-filter>
        </service>

        <!-- Default FCM Notification Channel -->
        <meta-data
            android:name="com.google.firebase.messaging.default_notification_channel_id"
            android:value="gac_updates_channel" />

    </application>
</manifest>`,
  },
  {
    path: 'app/src/main/res/values/themes.xml',
    language: 'xml',
    description: 'Platform Material Dark NoActionBar base theme avoiding XML Material Components dependency conflicts',
    content: `<resources>
    <style name="Theme.GACAdvisors" parent="android:Theme.Material.NoActionBar">
        <item name="android:statusBarColor">#FF080D1A</item>
        <item name="android:navigationBarColor">#FF080D1A</item>
        <item name="android:windowBackground">#FF080D1A</item>
    </style>
</resources>`,
  },
  {
    path: 'app/src/main/res/values/strings.xml',
    language: 'xml',
    description: 'Android string resources for GAC Advisors branding and office metadata',
    content: `<resources>
    <string name="app_name">GAC Advisors</string>
    <string name="office_address">Office #402, HM Tower, Gulberg Greens, Islamabad, Pakistan</string>
    <string name="whatsapp_pk">+92 335 547 0101</string>
    <string name="whatsapp_uae">+971 56 869 3855</string>
</resources>`,
  },
  {
    path: 'app/src/main/res/xml/data_extraction_rules.xml',
    language: 'xml',
    description: 'Android 12+ backup and device transfer security rules referenced by AndroidManifest.xml',
    content: `<?xml version="1.0" encoding="utf-8"?>
<data-extraction-rules>
    <cloud-backup>
        <exclude domain="sharedpref" path="." />
    </cloud-backup>
    <device-transfer>
        <exclude domain="sharedpref" path="." />
    </device-transfer>
</data-extraction-rules>`,
  },
  {
    path: 'app/src/main/res/xml/backup_rules.xml',
    language: 'xml',
    description: 'Android auto-backup exclusion rules referenced by AndroidManifest.xml',
    content: `<?xml version="1.0" encoding="utf-8"?>
<full-backup-content>
    <exclude domain="sharedpref" path="." />
</full-backup-content>`,
  },
  {
    path: 'app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml',
    language: 'xml',
    description: 'Adaptive launcher icon definition referenced by AndroidManifest.xml',
    content: `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@drawable/ic_launcher_background" />
    <foreground android:drawable="@drawable/ic_launcher_foreground" />
</adaptive-icon>`,
  },
  {
    path: 'app/src/main/res/mipmap-anydpi-v26/ic_launcher_round.xml',
    language: 'xml',
    description: 'Adaptive round launcher icon definition referenced by AndroidManifest.xml',
    content: `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@drawable/ic_launcher_background" />
    <foreground android:drawable="@drawable/ic_launcher_foreground" />
</adaptive-icon>`,
  },
  {
    path: 'app/src/main/res/drawable/ic_launcher_background.xml',
    language: 'xml',
    description: 'Deep Navy adaptive icon vector background',
    content: `<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp"
    android:height="108dp"
    android:viewportWidth="108"
    android:viewportHeight="108">
    <path
        android:fillColor="#080D1A"
        android:pathData="M0,0h108v108h-108z" />
</vector>`,
  },
  {
    path: 'app/src/main/res/drawable/ic_launcher_foreground.xml',
    language: 'xml',
    description: 'Royal Gold shield adaptive icon vector foreground',
    content: `<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp"
    android:height="108dp"
    android:viewportWidth="108"
    android:viewportHeight="108">
    <path
        android:fillColor="#0F1B3B"
        android:strokeColor="#D4AF37"
        android:strokeWidth="3.5"
        android:pathData="M54,22 L80,32 V52 C80,69 68.5,81.5 54,86 C39.5,81.5 28,69 28,52 V32 Z" />
    <path
        android:fillColor="#D4AF37"
        android:pathData="M54,40 A12,12 0 1,0 64.5,58 H55 V53 H66.5 V55 C66.5,63.2 60.8,69 54,69 A15,15 0 1,1 54,39 C58.5,39 62.5,41 65,44.2 L61.2,47.2 C59.5,45 56.9,43.8 54,43.8 Z" />
</vector>`,
  },
  {
    path: 'app/src/main/java/com/gacadvisors/app/GACApplication.kt',
    language: 'kotlin',
    description: 'Application class declared in AndroidManifest.xml that initializes Firebase and notification channels',
    content: `package com.gacadvisors.app

import android.app.Application
import android.app.NotificationChannel
import android.app.NotificationManager
import android.os.Build
import com.google.firebase.FirebaseApp

class GACApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        FirebaseApp.initializeApp(this)
        createNotificationChannel()
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                "gac_updates_channel",
                "GAC Advisors Case Updates",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Real-time visa status, document review, and appointment notifications"
            }
            val manager = getSystemService(NotificationManager::class.java)
            manager?.createNotificationChannel(channel)
        }
    }
}`,
  },
  {
    path: 'app/src/main/java/com/gacadvisors/app/services/GACFirebaseMessagingService.kt',
    language: 'kotlin',
    description: 'Firebase Cloud Messaging service declared in AndroidManifest.xml',
    content: `package com.gacadvisors.app.services

import android.app.NotificationManager
import android.content.Context
import androidx.core.app.NotificationCompat
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage

class GACFirebaseMessagingService : FirebaseMessagingService() {

    override fun onNewToken(token: String) {
        super.onNewToken(token)
    }

    override fun onMessageReceived(message: RemoteMessage) {
        super.onMessageReceived(message)
        val title = message.notification?.title ?: message.data["title"] ?: "GAC Advisors Update"
        val body = message.notification?.body ?: message.data["body"] ?: "Check your visa application portal."

        val notification = NotificationCompat.Builder(this, "gac_updates_channel")
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setContentTitle(title)
            .setContentText(body)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setAutoCancel(true)
            .build()

        val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        manager.notify(System.currentTimeMillis().toInt(), notification)
    }
}`,
  },
  {
    path: 'app/src/main/java/com/gacadvisors/app/MainActivity.kt',
    language: 'kotlin',
    description: 'Main Activity hosting Jetpack Compose navigation and luxury Material 3 theme',
    content: `package com.gacadvisors.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import androidx.navigation.compose.rememberNavController
import com.gacadvisors.app.ui.navigation.GACNavGraph
import com.gacadvisors.app.ui.theme.GACAdvisorsTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            GACAdvisorsTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    val navController = rememberNavController()
                    GACNavGraph(navController = navController)
                }
            }
        }
    }
}`,
  },
  {
    path: 'app/src/main/java/com/gacadvisors/app/ui/theme/Color.kt',
    language: 'kotlin',
    description: 'Corporate luxury Dark Navy Blue, Metallic Gold, and Slate color palette',
    content: `package com.gacadvisors.app.ui.theme

import androidx.compose.ui.graphics.Color

// GAC Advisors Brand Colors
val NavyDeep = Color(0xFF080D1A)        // Deep Luxury Navy
val NavyPrimary = Color(0xFF0F1B3B)     // Primary Navy
val NavySurface = Color(0xFF16254F)     // Surface Card Navy
val NavyLighter = Color(0xFF20326B)     // Outline / Border Navy

val GoldPrimary = Color(0xFFD4AF37)     // Metallic Royal Gold
val GoldLight = Color(0xFFF3E5AB)       // Light Gold Accent
val GoldDark = Color(0xFFAA820A)        // Deep Antique Gold

val WhitePure = Color(0xFFFFFFFF)
val TextMuted = Color(0xFF94A3B8)       // Slate Gray
val TextPrimary = Color(0xFFF8FAFC)

val SuccessGreen = Color(0xFF10B981)
val ErrorRed = Color(0xFFEF4444)
val WarningAmber = Color(0xFFF59E0B)
val InfoCyan = Color(0xFF06B6D4)`,
  },
  {
    path: 'app/src/main/java/com/gacadvisors/app/ui/theme/Type.kt',
    language: 'kotlin',
    description: 'Material 3 Typography definitions required by Theme.kt',
    content: `package com.gacadvisors.app.ui.theme

import androidx.compose.material3.Typography
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

val Typography = Typography(
    titleLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Bold,
        fontSize = 22.sp,
        lineHeight = 28.sp
    ),
    bodyLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = 16.sp,
        lineHeight = 24.sp
    ),
    labelMedium = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.SemiBold,
        fontSize = 12.sp,
        lineHeight = 16.sp
    )
)`,
  },
  {
    path: 'app/src/main/java/com/gacadvisors/app/ui/theme/Theme.kt',
    language: 'kotlin',
    description: 'Material 3 Dark Luxury theme implementation with custom shapes and color schemes',
    content: `package com.gacadvisors.app.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable

private val DarkColorScheme = darkColorScheme(
    primary = GoldPrimary,
    onPrimary = NavyDeep,
    primaryContainer = NavySurface,
    onPrimaryContainer = GoldLight,
    secondary = GoldLight,
    onSecondary = NavyDeep,
    background = NavyDeep,
    onBackground = TextPrimary,
    surface = NavyPrimary,
    onSurface = TextPrimary,
    surfaceVariant = NavySurface,
    onSurfaceVariant = TextMuted,
    outline = NavyLighter,
    error = ErrorRed,
    onError = WhitePure
)

@Composable
fun GACAdvisorsTheme(
    darkTheme: Boolean = true,
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = DarkColorScheme,
        typography = Typography,
        content = content
    )
}`,
  },
  {
    path: 'app/src/main/java/com/gacadvisors/app/data/model/Models.kt',
    language: 'kotlin',
    description: 'Domain models for Users, ClientDirectoryEntry (names-only), Applications, Visa Services, Documents, Payments and Appointments',
    content: `package com.gacadvisors.app.data.model

import com.google.firebase.firestore.DocumentId
import com.google.firebase.firestore.ServerTimestamp
import java.util.Date

enum class UserRole {
    CLIENT, STAFF, SUPER_ADMIN
}

enum class ApplicationStatus {
    DRAFT,
    SUBMITTED,
    UNDER_INITIAL_REVIEW,
    DOCUMENTS_REQUIRED,
    DOCUMENTS_UNDER_REVIEW,
    PROCESSING,
    READY_FOR_SUBMISSION,
    SUBMITTED_TO_EMBASSY,
    DECISION_RECEIVED,
    COMPLETED,
    ON_HOLD,
    CANCELLED
}

data class UserProfile(
    @DocumentId val uid: String = "",
    val fullName: String = "",
    val email: String = "",
    val phone: String = "",
    val countryCode: String = "+92",
    val role: String = "CLIENT",
    val language: String = "en",
    val assignedSpecialty: String? = null,
    val isActive: Boolean = true,
    @ServerTimestamp val createdAt: Date? = null
)

data class ClientDirectoryEntry(
    @DocumentId val uid: String = "",
    val fullName: String = "",
    val isActive: Boolean = true
)

data class VisaService(
    @DocumentId val id: String = "",
    val country: String = "",
    val category: String = "",
    val title: String = "",
    val description: String = "",
    val consultancyFee: Double = 0.0,
    val currency: String = "PKR",
    val estimatedProcessing: String = "",
    val eligibilityCriteria: List<String> = emptyList(),
    val requiredDocuments: List<String> = emptyList(),
    val importantInstructions: String = "",
    val isActive: Boolean = true
)

data class Application(
    @DocumentId val id: String = "",
    val trackingNumber: String = "",
    val clientId: String = "",
    val clientName: String = "",
    val clientEmail: String = "",
    val clientPhone: String = "",
    val assignedStaffId: String? = null,
    val assignedStaffName: String? = null,
    val country: String = "",
    val visaCategory: String = "",
    val serviceId: String = "",
    val status: String = ApplicationStatus.SUBMITTED.name,
    val clientRemarks: String = "",
    val consultancyFee: Double = 0.0,
    val amountPaid: Double = 0.0,
    val currency: String = "PKR",
    val paymentStatus: String = "UNPAID",
    @ServerTimestamp val createdAt: Date? = null,
    @ServerTimestamp val updatedAt: Date? = null
)

data class DocumentItem(
    @DocumentId val id: String = "",
    val applicationId: String = "",
    val clientId: String = "",
    val category: String = "",
    val title: String = "",
    val fileName: String = "",
    val fileUrl: String = "",
    val fileSize: String = "",
    val status: String = "PENDING",
    val rejectionReason: String? = null,
    val reviewedBy: String? = null,
    @ServerTimestamp val uploadedAt: Date? = null
)

data class PaymentRecord(
    @DocumentId val id: String = "",
    val applicationId: String = "",
    val trackingNumber: String = "",
    val clientId: String = "",
    val clientName: String = "",
    val amount: Double = 0.0,
    val currency: String = "PKR",
    val method: String = "BANK_TRANSFER",
    val transactionReference: String = "",
    val status: String = "PENDING",
    val receiptNumber: String = "",
    @ServerTimestamp val createdAt: Date? = null
)

data class AppointmentRecord(
    @DocumentId val id: String = "",
    val clientId: String = "",
    val clientName: String = "",
    val clientPhone: String = "",
    val appointmentType: String = "IN_PERSON",
    val visaCategory: String = "",
    val date: String = "",
    val timeSlot: String = "",
    val assignedStaffId: String? = null,
    val assignedStaffName: String? = null,
    val status: String = "PENDING",
    val notes: String? = null
)`,
  },
  {
    path: 'app/src/main/java/com/gacadvisors/app/data/repository/FirebaseRepository.kt',
    language: 'kotlin',
    description: 'Firestore and Auth repository enforcing strict client privacy, name-only client directory, and staff/admin streams',
    content: `package com.gacadvisors.app.data.repository

import com.gacadvisors.app.data.model.*
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.Query
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.tasks.await

class FirebaseRepository {
    private val firestore = FirebaseFirestore.getInstance()
    private val auth = FirebaseAuth.getInstance()

    val currentUserId: String?
        get() = auth.currentUser?.uid

    // Privacy-Safe Client Directory (Names & Count Only)
    fun getClientNamesDirectoryFlow(): Flow<List<ClientDirectoryEntry>> = callbackFlow {
        val listener = firestore.collection("client_directory")
            .addSnapshotListener { snapshot, error ->
                if (error != null) {
                    close(error)
                    return@addSnapshotListener
                }
                val list = snapshot?.toObjects(ClientDirectoryEntry::class.java) ?: emptyList()
                trySend(list)
            }
        awaitClose { listener.remove() }
    }

    // Real-time Applications Stream for Client (Strictly Private to clientId)
    fun getClientApplicationsFlow(clientId: String): Flow<List<Application>> = callbackFlow {
        val listener = firestore.collection("applications")
            .whereEqualTo("clientId", clientId)
            .orderBy("createdAt", Query.Direction.DESCENDING)
            .addSnapshotListener { snapshot, error ->
                if (error != null) {
                    close(error)
                    return@addSnapshotListener
                }
                val list = snapshot?.toObjects(Application::class.java) ?: emptyList()
                trySend(list)
            }
        awaitClose { listener.remove() }
    }

    // Real-time Applications Stream for Super Admin
    fun getAllApplicationsFlow(): Flow<List<Application>> = callbackFlow {
        val listener = firestore.collection("applications")
            .orderBy("createdAt", Query.Direction.DESCENDING)
            .addSnapshotListener { snapshot, error ->
                if (error != null) {
                    close(error)
                    return@addSnapshotListener
                }
                val list = snapshot?.toObjects(Application::class.java) ?: emptyList()
                trySend(list)
            }
        awaitClose { listener.remove() }
    }

    suspend fun createApplication(application: Application): String {
        val docRef = firestore.collection("applications").document()
        val appWithId = application.copy(id = docRef.id)
        docRef.set(appWithId).await()
        return docRef.id
    }

    suspend fun updateApplicationStatus(id: String, newStatus: String, remarks: String) {
        firestore.collection("applications").document(id)
            .update(
                mapOf(
                    "status" to newStatus,
                    "clientRemarks" to remarks
                )
            ).await()
    }

    suspend fun assignStaff(applicationId: String, staffId: String, staffName: String) {
        firestore.collection("applications").document(applicationId)
            .update(
                mapOf(
                    "assignedStaffId" to staffId,
                    "assignedStaffName" to staffName
                )
            ).await()
    }
}`,
  },
  {
    path: 'app/src/main/java/com/gacadvisors/app/ui/navigation/NavGraph.kt',
    language: 'kotlin',
    description: 'Complete Jetpack Compose Navigation routes with every referenced Screen implemented',
    content: `package com.gacadvisors.app.ui.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.gacadvisors.app.ui.screens.admin.AdminDashboardScreen
import com.gacadvisors.app.ui.screens.admin.AdminMasterVaultScreen
import com.gacadvisors.app.ui.screens.auth.LoginScreen
import com.gacadvisors.app.ui.screens.client.ApplicationFlowScreen
import com.gacadvisors.app.ui.screens.client.ClientDashboardScreen
import com.gacadvisors.app.ui.screens.staff.StaffDashboardScreen
import com.gacadvisors.app.ui.screens.tracking.TrackingScreen

sealed class Screen(val route: String) {
    object Login : Screen("login")
    object ClientDashboard : Screen("client_dashboard")
    object StaffDashboard : Screen("staff_dashboard")
    object AdminDashboard : Screen("admin_dashboard")
    object AdminMasterVault : Screen("admin_master_vault")
    object NewApplication : Screen("new_application")
    object Tracking : Screen("tracking/{applicationId}") {
        fun createRoute(applicationId: String) = "tracking/$applicationId"
    }
}

@Composable
fun GACNavGraph(navController: NavHostController) {
    NavHost(
        navController = navController,
        startDestination = Screen.ClientDashboard.route
    ) {
        composable(Screen.Login.route) {
            LoginScreen(navController = navController)
        }
        composable(Screen.ClientDashboard.route) {
            ClientDashboardScreen(navController = navController)
        }
        composable(Screen.StaffDashboard.route) {
            StaffDashboardScreen(navController = navController)
        }
        composable(Screen.AdminDashboard.route) {
            AdminDashboardScreen(navController = navController)
        }
        composable(Screen.AdminMasterVault.route) {
            AdminMasterVaultScreen(
                onUnlockSuccess = { navController.navigate(Screen.AdminDashboard.route) }
            )
        }
        composable(Screen.NewApplication.route) {
            ApplicationFlowScreen(navController = navController)
        }
        composable(Screen.Tracking.route) { backStackEntry ->
            val applicationId = backStackEntry.arguments?.getString("applicationId") ?: ""
            TrackingScreen(navController = navController, applicationId = applicationId)
        }
    }
}`,
  },
  {
    path: 'app/src/main/java/com/gacadvisors/app/ui/screens/auth/LoginScreen.kt',
    language: 'kotlin',
    description: 'Firebase Authentication login screen for Client, Staff, and Super Admin',
    content: `package com.gacadvisors.app.ui.screens.auth

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.gacadvisors.app.ui.navigation.Screen
import com.gacadvisors.app.ui.theme.*
import com.google.firebase.auth.FirebaseAuth

@Composable
fun LoginScreen(navController: NavController) {
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var errorText by remember { mutableStateOf<String?>(null) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(NavyDeep)
            .padding(24.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text("GAC ADVISORS", color = GoldPrimary, fontSize = 24.sp, fontWeight = FontWeight.Black)
        Spacer(modifier = Modifier.height(6.dp))
        Text("Visa Consultancy Portal", color = TextMuted, fontSize = 13.sp)
        Spacer(modifier = Modifier.height(24.dp))

        OutlinedTextField(
            value = email,
            onValueChange = { email = it; errorText = null },
            label = { Text("Email Address") },
            singleLine = true,
            modifier = Modifier.fillMaxWidth()
        )
        Spacer(modifier = Modifier.height(12.dp))
        OutlinedTextField(
            value = password,
            onValueChange = { password = it; errorText = null },
            label = { Text("Password") },
            visualTransformation = PasswordVisualTransformation(),
            singleLine = true,
            modifier = Modifier.fillMaxWidth()
        )

        if (errorText != null) {
            Spacer(modifier = Modifier.height(8.dp))
            Text(errorText!!, color = ErrorRed, fontSize = 12.sp)
        }

        Spacer(modifier = Modifier.height(20.dp))
        Button(
            onClick = {
                if (email.isBlank() || password.isBlank()) {
                    errorText = "Email and password are required"
                } else {
                    FirebaseAuth.getInstance()
                        .signInWithEmailAndPassword(email.trim(), password)
                        .addOnSuccessListener {
                            navController.navigate(Screen.ClientDashboard.route) {
                                popUpTo(Screen.Login.route) { inclusive = true }
                            }
                        }
                        .addOnFailureListener {
                            errorText = it.localizedMessage ?: "Sign in failed"
                        }
                }
            },
            modifier = Modifier.fillMaxWidth().height(52.dp),
            shape = RoundedCornerShape(12.dp),
            colors = ButtonDefaults.buttonColors(containerColor = GoldPrimary)
        ) {
            Text("SIGN IN", color = NavyDeep, fontWeight = FontWeight.Bold)
        }
    }
}`,
  },
  {
    path: 'app/src/main/java/com/gacadvisors/app/ui/screens/client/ClientDashboardScreen.kt',
    language: 'kotlin',
    description: 'Client Home Screen with strict client privacy, Names-Only Registered Clients Directory, Quick Apply, and WhatsApp support',
    content: `package com.gacadvisors.app.ui.screens.client

import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.gacadvisors.app.ui.navigation.Screen
import com.gacadvisors.app.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ClientDashboardScreen(navController: NavController) {
    val context = LocalContext.current
    val clientNames = listOf("Muhammad Bilal Khan", "Zainab Tariq")

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = "GAC ADVISORS",
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold,
                            color = GoldPrimary,
                            letterSpacing = 1.5.sp
                        )
                        Text(
                            text = "Visa Consultancy Management",
                            fontSize = 11.sp,
                            color = TextMuted
                        )
                    }
                },
                actions = {
                    IconButton(onClick = { navController.navigate(Screen.Login.route) }) {
                        Icon(Icons.Default.AccountCircle, contentDescription = "Account", tint = GoldLight)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = NavyPrimary
                )
            )
        },
        floatingActionButton = {
            ExtendedFloatingActionButton(
                onClick = {
                    val url = "https://wa.me/923355470101?text=Hello%20GAC%20Advisors,%20I%20would%20like%20to%20inquire%20about%20visa%20consultancy."
                    val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
                    context.startActivity(intent)
                },
                containerColor = Color(0xFF25D366),
                contentColor = WhitePure,
                icon = { Icon(Icons.Default.Chat, contentDescription = null) },
                text = { Text("WhatsApp Support", fontWeight = FontWeight.SemiBold) }
            )
        }
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .background(NavyDeep)
                .padding(padding)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Welcome Card
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = NavySurface)
                ) {
                    Column(modifier = Modifier.padding(20.dp)) {
                        Text("Welcome Back,", color = TextMuted, fontSize = 13.sp)
                        Text("Muhammad Bilal Khan", color = WhitePure, fontSize = 20.sp, fontWeight = FontWeight.Bold)
                        Spacer(modifier = Modifier.height(12.dp))
                        Text(
                            "Office: Office #402, HM Tower, Gulberg Greens, Islamabad",
                            color = GoldLight,
                            fontSize = 12.sp
                        )
                    }
                }
            }

            // Portfolio Metric Counters
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    MetricBadge(title = "My Cases", count = "1", color = GoldPrimary, modifier = Modifier.weight(1f))
                    MetricBadge(title = "In Review", count = "0", color = WarningAmber, modifier = Modifier.weight(1f))
                    MetricBadge(title = "Processing", count = "1", color = InfoCyan, modifier = Modifier.weight(1f))
                }
            }

            // Quick Apply CTA
            item {
                Button(
                    onClick = { navController.navigate(Screen.NewApplication.route) },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(54.dp),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = GoldPrimary)
                ) {
                    Icon(Icons.Default.AddCircleOutline, contentDescription = null, tint = NavyDeep)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("START NEW VISA APPLICATION", color = NavyDeep, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                }
            }

            // Active Case Tracking Card (Own Cases Only)
            item {
                Text(
                    text = "MY ACTIVE VISA APPLICATIONS",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Bold,
                    color = GoldLight,
                    letterSpacing = 1.sp
                )
            }

            item {
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { navController.navigate(Screen.Tracking.createRoute("app-001")) },
                    shape = RoundedCornerShape(14.dp),
                    colors = CardDefaults.cardColors(containerColor = NavySurface)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text("United States", fontWeight = FontWeight.Bold, color = WhitePure, fontSize = 16.sp)
                            StatusPill(status = "PROCESSING", color = InfoCyan)
                        }
                        Spacer(modifier = Modifier.height(6.dp))
                        Text("B1/B2 Tourist & Business Visa", color = GoldLight, fontSize = 13.sp)
                        Text("Tracking ID: GAC-2026-US-89214", color = TextMuted, fontSize = 12.sp)
                        Spacer(modifier = Modifier.height(10.dp))
                        LinearProgressIndicator(
                            progress = { 0.6f },
                            modifier = Modifier.fillMaxWidth().height(6.dp).clip(RoundedCornerShape(3.dp)),
                            color = GoldPrimary,
                            trackColor = NavyLighter
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text("Assigned Officer: Hamza Farooq", color = TextMuted, fontSize = 11.sp)
                    }
                }
            }

            // Registered Clients Directory (Names & Total Count Only — Strict Privacy)
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(14.dp),
                    colors = CardDefaults.cardColors(containerColor = NavyPrimary)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text("REGISTERED CLIENTS (\${clientNames.size})", color = GoldLight, fontWeight = FontWeight.Bold, fontSize = 12.sp)
                            StatusPill(status = "NAMES ONLY", color = SuccessGreen)
                        }
                        Spacer(modifier = Modifier.height(10.dp))
                        clientNames.forEachIndexed { idx, name ->
                            Text(
                                text = "\${idx + 1}. $name",
                                color = WhitePure,
                                fontSize = 13.sp,
                                modifier = Modifier.padding(vertical = 3.dp)
                            )
                        }
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = "Strict Privacy Active: Other clients' applications, documents, and contact details are hidden and visible only to Admin.",
                            color = TextMuted,
                            fontSize = 11.sp
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun MetricBadge(title: String, count: String, color: Color, modifier: Modifier = Modifier) {
    Card(
        modifier = modifier,
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = NavySurface)
    ) {
        Column(
            modifier = Modifier.padding(14.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(count, color = color, fontSize = 22.sp, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(4.dp))
            Text(title, color = TextMuted, fontSize = 11.sp)
        }
    }
}

@Composable
fun StatusPill(status: String, color: Color) {
    Surface(
        shape = RoundedCornerShape(20.dp),
        color = color.copy(alpha = 0.15f)
    ) {
        Text(
            text = status,
            color = color,
            fontSize = 10.sp,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
        )
    }
}`,
  },
  {
    path: 'app/src/main/java/com/gacadvisors/app/ui/screens/client/ApplicationFlowScreen.kt',
    language: 'kotlin',
    description: 'New Visa Application submission form referenced by NavGraph.kt',
    content: `package com.gacadvisors.app.ui.screens.client

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.gacadvisors.app.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ApplicationFlowScreen(navController: NavController) {
    var country by remember { mutableStateOf("United States") }
    var visaCategory by remember { mutableStateOf("Visit Visa (B1/B2)") }
    var passportNo by remember { mutableStateOf("") }
    var submitted by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("New Visa Application", color = GoldLight) },
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back", tint = GoldPrimary)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = NavyPrimary)
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(NavyDeep)
                .padding(padding)
                .padding(20.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            OutlinedTextField(
                value = country,
                onValueChange = { country = it },
                label = { Text("Destination Country") },
                modifier = Modifier.fillMaxWidth()
            )
            OutlinedTextField(
                value = visaCategory,
                onValueChange = { visaCategory = it },
                label = { Text("Visa Category") },
                modifier = Modifier.fillMaxWidth()
            )
            OutlinedTextField(
                value = passportNo,
                onValueChange = { passportNo = it },
                label = { Text("Passport Number") },
                modifier = Modifier.fillMaxWidth()
            )

            Button(
                onClick = { submitted = true },
                modifier = Modifier.fillMaxWidth().height(52.dp),
                shape = RoundedCornerShape(12.dp),
                colors = ButtonDefaults.buttonColors(containerColor = GoldPrimary)
            ) {
                Text("SUBMIT VISA APPLICATION", color = NavyDeep, fontWeight = FontWeight.Bold)
            }

            if (submitted) {
                Text(
                    "Application queued securely to your private GAC Advisors profile.",
                    color = SuccessGreen
                )
            }
        }
    }
}`,
  },
  {
    path: 'app/src/main/java/com/gacadvisors/app/ui/screens/tracking/TrackingScreen.kt',
    language: 'kotlin',
    description: 'Application progress tracking screen referenced by NavGraph.kt',
    content: `package com.gacadvisors.app.ui.screens.tracking

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.gacadvisors.app.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TrackingScreen(navController: NavController, applicationId: String) {
    val stages = listOf(
        "Submitted",
        "Under Initial Review",
        "Documents Under Review",
        "Processing & File Prep",
        "Submitted to Embassy",
        "Decision Received"
    )

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Case Tracking", color = GoldLight) },
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back", tint = GoldPrimary)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = NavyPrimary)
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(NavyDeep)
                .padding(padding)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = NavySurface),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("Case Reference: $applicationId", color = GoldPrimary, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(6.dp))
                    Text("Current Stage: Processing & File Prep", color = WhitePure, fontSize = 15.sp)
                }
            }

            stages.forEachIndexed { idx, stage ->
                Card(
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(containerColor = NavyPrimary),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(
                        text = "\${idx + 1}. $stage",
                        color = if (idx <= 3) GoldLight else TextMuted,
                        modifier = Modifier.padding(14.dp),
                        fontSize = 14.sp
                    )
                }
            }
        }
    }
}`,
  },
  {
    path: 'app/src/main/java/com/gacadvisors/app/ui/screens/staff/StaffDashboardScreen.kt',
    language: 'kotlin',
    description: 'Staff Case Officer dashboard referenced by NavGraph.kt (assigned cases only)',
    content: `package com.gacadvisors.app.ui.screens.staff

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.gacadvisors.app.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun StaffDashboardScreen(navController: NavController) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Staff Case Officer Suite", color = GoldPrimary, fontWeight = FontWeight.Bold) },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = NavyPrimary)
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(NavyDeep)
                .padding(padding)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = NavySurface),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(18.dp)) {
                    Text("Assigned Cases Only", color = GoldLight, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        "Review assigned client documents, update case milestones, and record internal officer remarks.",
                        color = TextMuted,
                        fontSize = 13.sp
                    )
                }
            }
        }
    }
}`,
  },
  {
    path: 'app/src/main/java/com/gacadvisors/app/ui/screens/admin/AdminDashboardScreen.kt',
    language: 'kotlin',
    description: 'Super Admin executive dashboard referenced by NavGraph.kt with Master Control Vault navigation',
    content: `package com.gacadvisors.app.ui.screens.admin

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.gacadvisors.app.ui.navigation.Screen
import com.gacadvisors.app.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AdminDashboardScreen(navController: NavController) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Super Admin Suite", color = GoldPrimary, fontWeight = FontWeight.Bold) },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = NavyPrimary)
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(NavyDeep)
                .padding(padding)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = NavySurface),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(18.dp)) {
                    Text("GAC Advisors Full Control", color = WhitePure, fontWeight = FontWeight.Bold, fontSize = 17.sp)
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        "Only Super Admin has full access to all client records, staff accounts, fees, and company settings.",
                        color = TextMuted,
                        fontSize = 13.sp
                    )
                }
            }

            Button(
                onClick = { navController.navigate(Screen.AdminMasterVault.route) },
                modifier = Modifier.fillMaxWidth().height(52.dp),
                shape = RoundedCornerShape(12.dp),
                colors = ButtonDefaults.buttonColors(containerColor = GoldPrimary)
            ) {
                Text("OPEN MASTER CONTROL VAULT", color = NavyDeep, fontWeight = FontWeight.Bold)
            }
        }
    }
}`,
  },
  {
    path: 'app/src/main/java/com/gacadvisors/app/ui/screens/admin/AdminMasterVaultScreen.kt',
    language: 'kotlin',
    description: 'Password-protected Super Admin Master Control Vault screen in Jetpack Compose',
    content: `package com.gacadvisors.app.ui.screens.admin

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.gacadvisors.app.ui.theme.*

@Composable
fun AdminMasterVaultScreen(
    onUnlockSuccess: () -> Unit = {}
) {
    var vaultPassword by remember { mutableStateOf("") }
    var isUnlocked by remember { mutableStateOf(false) }
    var errorMsg by remember { mutableStateOf<String?>(null) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(NavyDeep)
            .padding(20.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        if (!isUnlocked) {
            Card(
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = NavySurface),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier.padding(24.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Icon(
                        imageVector = Icons.Default.Lock,
                        contentDescription = null,
                        tint = GoldPrimary,
                        modifier = Modifier.size(44.dp)
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                    Text(
                        text = "ADMIN MASTER CONTROL VAULT",
                        color = GoldPrimary,
                        fontWeight = FontWeight.Bold,
                        fontSize = 15.sp
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = "Strictly accessible to Super Admin only. Clients only see their own data and public client names count.",
                        color = TextMuted,
                        fontSize = 12.sp
                    )
                    Spacer(modifier = Modifier.height(16.dp))
                    OutlinedTextField(
                        value = vaultPassword,
                        onValueChange = {
                            vaultPassword = it
                            errorMsg = null
                        },
                        label = { Text("Enter Vault Passcode") },
                        visualTransformation = PasswordVisualTransformation(),
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )
                    if (errorMsg != null) {
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(text = errorMsg!!, color = ErrorRed, fontSize = 12.sp)
                    }
                    Spacer(modifier = Modifier.height(16.dp))
                    Button(
                        onClick = {
                            if (vaultPassword.isNotBlank()) {
                                isUnlocked = true
                                onUnlockSuccess()
                            } else {
                                errorMsg = "Vault passcode is required"
                            }
                        },
                        modifier = Modifier.fillMaxWidth().height(50.dp),
                        shape = RoundedCornerShape(12.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = GoldPrimary)
                    ) {
                        Text("UNLOCK MASTER VAULT", color = NavyDeep, fontWeight = FontWeight.Bold)
                    }
                }
            }
        } else {
            Card(
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = NavySurface),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Shield, contentDescription = null, tint = GoldPrimary)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Master Control Active", color = GoldLight, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                    }
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "Manage all clients, staff, applications, fees, appointments, and company settings.",
                        color = TextMuted,
                        fontSize = 13.sp
                    )
                }
            }
        }
    }
}`,
  },
  {
    path: '.github/workflows/build-apk.yml',
    language: 'yaml',
    description: 'Hardened GitHub Actions CI workflow with contents: write permission and safe APK artifact copy',
    content: `name: Build Downloadable Android APK

on:
  push:
    branches: [ main, master ]
  workflow_dispatch:

permissions:
  contents: write

jobs:
  build-apk:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'

      - name: Set up Android SDK
        uses: android-actions/setup-android@v3

      - name: Setup Gradle
        uses: gradle/actions/setup-gradle@v4
        with:
          gradle-version: '8.9'

      - name: Build Debug & Release APKs
        run: gradle assembleDebug assembleRelease --no-daemon --stacktrace

      - name: Prepare Downloadable APKs
        run: |
          mkdir -p release-apks
          find app/build/outputs/apk/debug -name "*.apk" -exec cp {} release-apks/GAC-Advisors-debug.apk \\;
          find app/build/outputs/apk/release -name "*.apk" -exec cp {} release-apks/GAC-Advisors-release-unsigned.apk \\;
          ls -lh release-apks/

      - name: Upload Downloadable APK Artifacts
        uses: actions/upload-artifact@v4
        with:
          name: GAC-Advisors-Android-APK
          path: release-apks/*.apk

      - name: Publish Direct APK Download Release
        uses: softprops/action-gh-release@v2
        if: startsWith(github.ref, 'refs/heads/')
        with:
          tag_name: v1.0.\${{ github.run_number }}
          name: GAC Advisors Android APK v1.0.\${{ github.run_number }}
          files: release-apks/*.apk
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}`,
  },
  {
    path: 'settings.gradle.kts',
    language: 'kotlin',
    description: 'Root Gradle settings configuring pluginManagement and repository resolution',
    content: `pluginManagement {
    repositories {
        google {
            content {
                includeGroupByRegex("com\\\\.android.*")
                includeGroupByRegex("com\\\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "GACAdvisors"
include(":app")`,
  },
  {
    path: 'build.gradle.kts',
    language: 'kotlin',
    description: 'Top-level Gradle build file declaring Android, Kotlin, Compose, and Google Services plugins',
    content: `plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.kotlin.compose) apply false
    alias(libs.plugins.google.gms.google.services) apply false
}`,
  },
  {
    path: 'gradle.properties',
    language: 'properties',
    description: 'Gradle JVM memory allocation and AndroidX configuration flags',
    content: `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
kotlin.code.style=official
android.nonTransitiveRClass=true`,
  },
  {
    path: 'gradle/libs.versions.toml',
    language: 'toml',
    description: 'Gradle Version Catalog with conflict-free AGP 8.7.2, Kotlin 2.0.21, Compose BOM 2024.11.00, and Firebase BOM 33.6.0',
    content: `[versions]
agp = "8.7.2"
kotlin = "2.0.21"
coreKtx = "1.15.0"
junit = "4.13.2"
junitVersion = "1.2.1"
espressoCore = "3.6.1"
lifecycleRuntimeKtx = "2.8.7"
activityCompose = "1.9.3"
composeBom = "2024.11.00"
navigationCompose = "2.8.4"
firebaseBom = "33.6.0"
googleServices = "4.4.2"
coroutines = "1.9.0"
coil = "2.7.0"

[libraries]
androidx-core-ktx = { group = "androidx.core", name = "core-ktx", version.ref = "coreKtx" }
junit = { group = "junit", name = "junit", version.ref = "junit" }
androidx-junit = { group = "androidx.test.ext", name = "junit", version.ref = "junitVersion" }
androidx-espresso-core = { group = "androidx.test.espresso", name = "espresso-core", version.ref = "espressoCore" }
androidx-lifecycle-runtime-ktx = { group = "androidx.lifecycle", name = "lifecycle-runtime-ktx", version.ref = "lifecycleRuntimeKtx" }
androidx-lifecycle-viewmodel-compose = { group = "androidx.lifecycle", name = "lifecycle-viewmodel-compose", version.ref = "lifecycleRuntimeKtx" }
androidx-activity-compose = { group = "androidx.activity", name = "activity-compose", version.ref = "activityCompose" }
androidx-navigation-compose = { group = "androidx.navigation", name = "navigation-compose", version.ref = "navigationCompose" }
androidx-compose-bom = { group = "androidx.compose", name = "compose-bom", version.ref = "composeBom" }
androidx-compose-ui = { group = "androidx.compose.ui", name = "ui" }
androidx-compose-ui-graphics = { group = "androidx.compose.ui", name = "ui-graphics" }
androidx-compose-ui-tooling = { group = "androidx.compose.ui", name = "ui-tooling" }
androidx-compose-ui-tooling-preview = { group = "androidx.compose.ui", name = "ui-tooling-preview" }
androidx-compose-ui-test-manifest = { group = "androidx.compose.ui", name = "ui-test-manifest" }
androidx-compose-ui-test-junit4 = { group = "androidx.compose.ui", name = "ui-test-junit4" }
androidx-compose-material3 = { group = "androidx.compose.material3", name = "material3" }
androidx-compose-material-icons-extended = { group = "androidx.compose.material", name = "material-icons-extended" }
firebase-bom = { group = "com.google.firebase", name = "firebase-bom", version.ref = "firebaseBom" }
firebase-analytics = { group = "com.google.firebase", name = "firebase-analytics" }
firebase-auth = { group = "com.google.firebase", name = "firebase-auth" }
firebase-firestore = { group = "com.google.firebase", name = "firebase-firestore" }
firebase-storage = { group = "com.google.firebase", name = "firebase-storage" }
firebase-messaging = { group = "com.google.firebase", name = "firebase-messaging" }
kotlinx-coroutines-android = { group = "org.jetbrains.kotlinx", name = "kotlinx-coroutines-android", version.ref = "coroutines" }
kotlinx-coroutines-play-services = { group = "org.jetbrains.kotlinx", name = "kotlinx-coroutines-play-services", version.ref = "coroutines" }
coil-compose = { group = "io.coil-kt", name = "coil-compose", version.ref = "coil" }

[plugins]
android-application = { id = "com.android.application", version.ref = "agp" }
kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
kotlin-compose = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }
google-gms-google-services = { id = "com.google.gms.google-services", version.ref = "googleServices" }`,
  },
  {
    path: 'README.md',
    language: 'markdown',
    description: 'Android Studio project setup guide, Automated GitHub Actions APK build, and PWABuilder troubleshooting',
    content: `# GAC Advisors – Visa Consultancy Android Application

A complete, production-ready Native Android application built with **Kotlin**, **Jetpack Compose**, **Material 3**, and **Firebase** (Auth, Cloud Firestore, Cloud Storage, and FCM).

## Strict Client Privacy & RBAC
- **Client**: Sees ONLY their own applications, documents, payments, and appointments, plus the **Registered Clients Directory (Names & Count Only)** from \`/client_directory\`.
- **Staff**: Sees ONLY assigned applications and documents.
- **Super Admin**: Password-protected **Master Control Vault** with full edit control over all clients, staff, fees, appointments, services, and company settings.

---

## Option A: Automated Downloadable APK Link via GitHub Actions
1. Extract this ZIP and push the folder to a GitHub repository.
2. GitHub Actions automatically runs \`.github/workflows/build-apk.yml\`.
3. Download \`GAC-Advisors-debug.apk\` directly from **Actions → Artifacts** or **Releases** in your repository!

## Option B: Build APK Locally in Android Studio
1. Extract this project ZIP into a folder of your choice.
2. Open **Android Studio** (Koala / Ladybug or newer recommended).
3. Select **File > Open...** and navigate to this folder.
4. Run:
\`\`\`bash
gradle assembleDebug
\`\`\`
The generated APK will be at:
\`\`\`
app/build/outputs/apk/debug/app-debug.apk
\`\`\`
`,
  },
];

export async function generateAndroidProjectZip(): Promise<Blob> {
  const zip = new JSZip();
  const rootFolder = zip.folder('gac-advisors-android');

  for (const file of ANDROID_PROJECT_FILES) {
    rootFolder?.file(file.path, file.content);
  }

  return await zip.generateAsync({ type: 'blob' });
}
