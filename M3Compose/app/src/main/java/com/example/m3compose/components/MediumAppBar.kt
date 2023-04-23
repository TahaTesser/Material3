package com.example.m3compose.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.Menu
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.input.nestedscroll.nestedScroll
import androidx.compose.ui.unit.dp
import com.example.m3compose.ui.theme.M3ComposeTheme

class MediumAppBar {
    @OptIn(ExperimentalMaterial3Api::class)
    @Composable
    fun BuildLargeAppBar() {
        M3ComposeTheme() {
            val scrollBehavior = TopAppBarDefaults.exitUntilCollapsedScrollBehavior()
            Scaffold(modifier = Modifier.nestedScroll(scrollBehavior.nestedScrollConnection),
                topBar = {
                    MediumTopAppBar(
                        navigationIcon = {
                            IconButton(onClick = { /*TODO*/ }) {
                                Icon(
                                    imageVector = Icons.Default.Menu, contentDescription = "Menu"
                                )
                            }
                        },
                        title = {
                            Text(
                                "Medium App Bar",
                                maxLines = 1,
//                                    overflow = TextOverflow.Ellipsis
                            )
                        },
                        actions = {
                            IconButton(onClick = { /*TODO*/ }) {
                                Icon(
                                    imageVector = Icons.Filled.Favorite, contentDescription = "Menu"
                                )
                            }
                            IconButton(onClick = { /*TODO*/ }) {
                                Icon(
                                    imageVector = Icons.Filled.Favorite, contentDescription = "Menu"
                                )
                            }
                        },
                        scrollBehavior = scrollBehavior,
//                            colors = TopAppBarDefaults.mediumTopAppBarColors(
//                                containerColor = Color(0xff00ff00),
//                            ),
                    )
                },
                content = { innerPadding ->
                    LazyColumn(
                        contentPadding = innerPadding,
                        verticalArrangement = Arrangement.spacedBy(8.dp),

                        ) {

                        val list = (0..75).map { it.toString() }
                        items(count = list.size) {
                            ListItem(headlineContent = { Text(text = list[it]) })
                        }
                    }
                })
        }
    }
}