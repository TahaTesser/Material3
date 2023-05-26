package com.example.m3compose.components

import androidx.compose.runtime.Composable
import androidx.compose.material3.DatePicker
import androidx.compose.material3.DatePickerDialog
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.rememberDatePickerState
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.material3.DatePickerDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import com.example.m3compose.ui.theme.M3ComposeTheme
import kotlinx.coroutines.launch

class DatePicker {

    @OptIn(ExperimentalMaterial3Api::class)
    @Composable
    fun BuildDatePicker() {


        M3ComposeTheme {
            val snackState = remember { SnackbarHostState() }
            val snackScope = rememberCoroutineScope()
            SnackbarHost(hostState = snackState, Modifier)
            val openDialog = remember { mutableStateOf(true) }
// TODO demo how to read the selected date from the state.
            if (openDialog.value) {
                val datePickerState = rememberDatePickerState()

                DatePickerDialog(onDismissRequest = {

                    openDialog.value = false
                }, confirmButton = {
                    TextButton(
                        onClick = {
                            openDialog.value = false
                            snackScope.launch {
                                snackState.showSnackbar(
                                    "Selected date timestamp: ${datePickerState.selectedDateMillis}"
                                )
                            }
                        }, enabled = true
                    ) {
                        Text("OK")
                    }
                }, dismissButton = {
                    TextButton(onClick = {
                        openDialog.value = false
                    }) {
                        Text("Cancel")
                    }
                }) {
                    DatePicker(
                        state = datePickerState, colors = DatePickerDefaults.colors(
                            headlineContentColor = Color.Blue
                        )
                    )
                }
            }


        }
    }
}