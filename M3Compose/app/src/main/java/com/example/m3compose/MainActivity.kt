package com.example.m3compose

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import com.example.m3compose.components.Chips
import com.example.m3compose.components.DatePicker
import com.example.m3compose.components.ListTile
import com.example.m3compose.components.MediumAppBar
import com.example.m3compose.components.NavBar
import com.example.m3compose.components.TabBar
import com.example.m3compose.ui.theme.M3ComposeTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
//        val mediumAppBar = MediumAppBar()
//        val chips = Chips()
//        val tabbar = TabBar()
//        val datePicker = DatePicker()
//        val listTile = ListTile()
        val navBar = NavBar()

        setContent {
            navBar.BuildNavBar()

        }
    }
}
