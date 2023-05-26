package com.example.m3compose.components

import androidx.compose.runtime.Composable
import androidx.compose.material3.ExperimentalMaterial3Api
import com.example.m3compose.ui.theme.M3ComposeTheme
import androidx.compose.foundation.layout.Column
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material3.Divider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.ListItem
import androidx.compose.material3.Text

class ListTile {

    @OptIn(ExperimentalMaterial3Api::class)
    @Composable
    fun BuildListTile() {


        M3ComposeTheme {
            Column {
                ListItem(
                    headlineContent = { Text("One line list item with 24x24 icon") },
                    trailingContent = {
                        Icon(
                            Icons.Filled.Favorite,
                            contentDescription = "Localized description",
                        )
                    }
                )
                Divider()
                ListItem(
                    headlineContent = { Text("One line list item with 24x24 icon") },
                    trailingContent = {
                        IconButton(onClick = {}) {
                            Icon(
                                Icons.Filled.Favorite,
                                contentDescription = "Localized description",
                            )
                        }
                    }
                )
                Divider()
            }

        }
    }
}