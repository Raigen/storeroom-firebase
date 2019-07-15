import MenuItem, { MenuItemProps } from '@material-ui/core/MenuItem'
import TextField, { TextFieldProps } from '@material-ui/core/TextField'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'

import Downshift from 'downshift'
import Paper from '@material-ui/core/Paper'
import React from 'react'

const useStyles = makeStyles<Theme, AutoSuggestProps>((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      height: 250
    },
    container: {
      flexGrow: 1,
      position: 'relative',
      display: 'inline-flex',
      verticalAlign: 'top',
      padding: '0 10px'
    },
    paper: {
      position: 'absolute',
      zIndex: 1,
      marginTop: theme.spacing(1),
      left: 0,
      right: 0
    },
    inputRoot: {
      flexWrap: 'wrap',
      width: props => props.inputWidth
    },
    inputInput: {
      width: 'auto',
      flexGrow: 1
    }
  })
)

export type Suggestion = {
  name: string
  unit?: string
  ref?: firebase.firestore.DocumentReference
}

type RenderInputProps = TextFieldProps & {
  classes: ReturnType<typeof useStyles>
  ref?: React.Ref<HTMLDivElement>
}

function renderInput(inputProps: RenderInputProps) {
  const { InputProps, classes, ref, ...other } = inputProps

  return (
    <TextField
      InputProps={{
        inputRef: ref,
        classes: {
          root: classes.inputRoot,
          input: classes.inputInput
        },
        ...InputProps
      }}
      {...other}
    />
  )
}

interface RenderSuggestionProps {
  highlightedIndex: number | null
  index: number
  itemProps: MenuItemProps<'div', { button?: never }>
  selectedItem: Suggestion['name']
  suggestion: Suggestion
}

function renderSuggestion(suggestionProps: RenderSuggestionProps) {
  const { suggestion, index, itemProps, highlightedIndex, selectedItem } = suggestionProps
  const isHighlighted = highlightedIndex === index
  const isSelected = (selectedItem || '').indexOf(suggestion.name) > -1

  return (
    <MenuItem
      {...itemProps}
      key={suggestion.name}
      selected={isHighlighted}
      component="div"
      style={{
        fontWeight: isSelected ? 500 : 400
      }}
    >
      {suggestion.name}
    </MenuItem>
  )
}

const prepareGetSuggestions = (suggestions: Suggestion[]) => (value: string, { showEmpty = false } = {}) => {
  const inputValue = value.trim().toLowerCase()
  const inputLength = inputValue.length
  let count = 0

  return inputLength === 0 && !showEmpty
    ? []
    : suggestions.filter(suggestion => {
        const keep = count < 5 && suggestion.name.slice(0, inputLength).toLowerCase() === inputValue

        if (keep) {
          count += 1
        }

        return keep
      })
}

type AutoSuggestProps = {
  suggestions: Suggestion[]
  placeholder?: string
  disabled?: boolean
  inputWidth: number
  onChange: (value: Suggestion) => void
}

export const Autosuggest: React.FC<AutoSuggestProps> = props => {
  const { suggestions, placeholder, disabled, onChange } = props
  const classes = useStyles(props)
  const getSuggestions = React.useCallback(prepareGetSuggestions(suggestions), [suggestions])
  const handleChange = (value: string) => {
    const oldSuggestion = suggestions.find(suggestion => suggestion.name === value)
    onChange(oldSuggestion ? oldSuggestion : { name: value, ref: undefined })
  }
  return (
    <Downshift id="downshift-simple" onChange={handleChange}>
      {({
        getInputProps,
        getItemProps,
        getLabelProps,
        getMenuProps,
        highlightedIndex,
        inputValue,
        isOpen,
        selectedItem
      }) => {
        const { onBlur, onFocus, ...inputProps } = getInputProps({
          placeholder: placeholder || '',
          disabled
        })

        return (
          <div className={classes.container}>
            {renderInput({
              fullWidth: true,
              classes,
              label: '',
              InputLabelProps: getLabelProps({ shrink: true } as any),
              InputProps: { onBlur, onFocus },
              inputProps
            })}
            <div {...getMenuProps()}>
              {isOpen ? (
                <Paper className={classes.paper} square>
                  {[{ name: inputValue || '' }]
                    .filter(suggestion => suggestion.name.length > 0)
                    .concat(getSuggestions(inputValue!, { showEmpty: true }))
                    .map((suggestion, index) =>
                      renderSuggestion({
                        suggestion,
                        index,
                        itemProps: getItemProps({ item: suggestion.name }),
                        highlightedIndex,
                        selectedItem
                      })
                    )}
                </Paper>
              ) : null}
            </div>
          </div>
        )
      }}
    </Downshift>
  )
}
