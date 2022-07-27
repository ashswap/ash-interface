import React from "react"

export interface WebComponent<T> extends React.DetailedHTMLProps<React.HTMLAttributes<T>, T> {

}