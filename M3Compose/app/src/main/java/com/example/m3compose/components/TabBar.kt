package com.example.m3compose.components

import androidx.compose.foundation.layout.Column
import androidx.compose.material3.MaterialTheme
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
import com.example.m3compose.ui.theme.M3ComposeTheme

class TabBar {

    @Composable
    fun BuildTabBar() {

        M3ComposeTheme() {
            var state by remember { mutableStateOf(0) }
            val titles = listOf("Tab 1", "Tab 2", "Tab 3 with lots of text")
            Column {
                ScrollableTabRow(selectedTabIndex = state) {
                    titles.forEachIndexed { index, title ->
                        Tab(
                            selected = state == index,
                            onClick = { state = index },
                            text = { Text(text = title) }
                        )
                    }
                }
                Text(
                    modifier = Modifier.align(Alignment.CenterHorizontally),
                    text = "Text tab ${state + 1} selected",
                    style = MaterialTheme.typography.bodyLarge
                )
            }
        }
    }
}