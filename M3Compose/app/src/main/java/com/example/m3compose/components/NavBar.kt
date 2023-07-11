package com.example.m3compose.components

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material3.Divider
import androidx.compose.material3.FabPosition
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.ScrollableTabRow
import androidx.compose.material3.Tab
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.example.m3compose.ui.theme.M3ComposeTheme

class NavBar {

    @Composable
    fun BuildNavBar() {

        M3ComposeTheme() {
            var selectedItem by remember { mutableStateOf(0) }
            val items = listOf("Songs", "Artists", "Playlists", "Releases")

            Scaffold(
                topBar = {
                    // TopBar content here
                },
                floatingActionButton = {
                    FloatingActionButton(onClick = { /* Do something here */ }) {
                        Icon(Icons.Filled.Add, contentDescription = "Localized description")
                    }
                },
                floatingActionButtonPosition = FabPosition.Center,
                bottomBar = {
                    NavigationBar {
                        items.forEachIndexed { index, item ->
                            NavigationBarItem(
                                icon = { Icon(Icons.Filled.Favorite, contentDescription = item) },
                                label = { Text(item) },
                                selected = selectedItem == index,
                                onClick = { selectedItem = index }
                            )
                        }
                    }
                },
                content = { innerPadding ->
                    Box(modifier = Modifier.padding(innerPadding)) {
                        // main content here
                    }
                }
            )

        }
    }
}
