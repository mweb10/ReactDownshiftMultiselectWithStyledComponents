/**
 * Example of how to use Downshift to create a multi-select
 * that uses Styled Components.
 *
 * Based on this sandbox by Kent C. Dodds:
 * https://codesandbox.io/s/0p21okv38p
 */

import React from 'react'
import Downshift from 'downshift'
import matchSorter from 'match-sorter'
import styled from 'styled-components'
import starWarsNames from 'starwars-names'

const allItems = starWarsNames.all.map(s => ({name: s, id: s.toLowerCase()}))

const getItems = filter => {
  return filter
    ? matchSorter(allItems, filter, {
        keys: ['name'],
      })
    : allItems
}

const Menu = styled.ul`
  padding: 0;
  margin-top: 0;
  position: absolute;
  background-color: white;
  width: 100%;
  max-height: 20rem;
  overflow-y: auto;
  overflow-x: hidden;
  outline: 0;
  transition: opacity 0.1s ease;
  border-radius: 0 0 0.28571429rem 0.28571429rem;
  box-shadow: 0 2px 3px 0 rgba(34, 36, 38, 0.15);
  border-color: #96c8da;
  border-top-width: 0;
  border-right-width: 1px;
  border-bottom-width: 1px;
  border-left-width: 1px;
  border-style: solid;
  border: ${props => (props.isOpen ? null : 'none')};
`

const ControllerButton = styled.button`
  background-color: transparent;
  border: none;
  position: absolute;
  right: 0;
  top: 0;
  cursor: pointer;
  width: 47px;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  align-items: center;
`

const Item = styled.li`
  position: relative;
  cursor: pointer;
  display: block;
  border: none;
  height: auto;
  text-align: left;
  border-top: none;
  line-height: 1em;
  color: rgba(0, 0, 0, 0.87);
  font-size: 1rem;
  text-transform: none;
  font-weight: 400;
  box-shadow: none;
  padding: 0.8rem 1.1rem;
  white-space: normal;
  word-wrap: normal;

  ${({isActive}) =>
    isActive &&
    `
    color: rgba(0,0,0,.95);
    background: rgba(0,0,0,.03);
  `}

  ${({isSelected}) =>
    isSelected &&
    `
    color: rgba(0,0,0,.95);
    font-weight: 700;
  `}
`

const ArrowIcon = ({isOpen}) => (
  <svg
    viewBox="0 0 20 20"
    preserveAspectRatio="none"
    width={16}
    fill="transparent"
    stroke="#979797"
    strokeWidth="1.1px"
    transform={isOpen ? 'rotate(180)' : null}
  >
    <path d="M1,6 L10,15 L19,6" />
  </svg>
)

class MultiDownshift extends React.Component {
  state = {selectedItems: []}

  stateReducer = (state, changes) => {
    switch (changes.type) {
      case Downshift.stateChangeTypes.keyDownEnter:
      case Downshift.stateChangeTypes.clickItem:
        return {
          ...changes,
          highlightedIndex: state.highlightedIndex,
          isOpen: true,
          inputValue: '',
        }
      default:
        return changes
    }
  }

  handleSelection = (selectedItem, downshift) => {
    const callOnChange = () => {
      const {onSelect, onChange} = this.props
      const {selectedItems} = this.state
      if (onSelect) {
        onSelect(selectedItems, this.getStateAndHelpers(downshift))
      }
      if (onChange) {
        onChange(selectedItems, this.getStateAndHelpers(downshift))
      }
    }
    if (this.state.selectedItems.includes(selectedItem)) {
      this.removeItem(selectedItem, callOnChange)
    } else {
      this.addSelectedItem(selectedItem, callOnChange)
    }
  }

  removeItem = (item, cb) => {
    this.setState(({selectedItems}) => {
      return {
        selectedItems: selectedItems.filter(i => i !== item),
      }
    }, cb)
  }
  addSelectedItem(item, cb) {
    this.setState(
      ({selectedItems}) => ({
        selectedItems: [...selectedItems, item],
      }),
      cb,
    )
  }

  getRemoveButtonProps = ({onClick, item, ...props} = {}) => {
    return {
      onClick: e => {
        // TODO: use something like downshift's composeEventHandlers utility instead
        onClick && onClick(e)
        e.stopPropagation()
        this.removeItem(item)
      },
      ...props,
    }
  }

  getStateAndHelpers(downshift) {
    const {selectedItems} = this.state
    const {getRemoveButtonProps, removeItem} = this
    return {
      getRemoveButtonProps,
      removeItem,
      selectedItems,
      ...downshift,
    }
  }
  render() {
    const {render, children = render, ...props} = this.props
    // TODO: compose together props (rather than overwriting them) like downshift does
    return (
      <Downshift
        {...props}
        stateReducer={this.stateReducer}
        onChange={this.handleSelection}
        selectedItem={null}
      >
        {downshift => children(this.getStateAndHelpers(downshift))}
      </Downshift>
    )
  }
}

class MultiDropdownApp extends React.Component {
  input = React.createRef()
  itemToString = item => (item ? item.name : '')
  handleChange = selectedItems => {
    console.log({selectedItems})
  }
  render() {
    const MultiDownshiftContainer = styled.div`
      display: flex;
      flex-direction: column;
      margin-top: 50px;
    `

    const Dropdown = styled.div`
      cursor: pointer;
      position: relative;
      border-radius: 6px;
      border-bottom-right-radius: ${props => (props.isOpen ? '0' : '6px')};
      border-bottom-left-radius: ${props => (props.isOpen ? '0' : '6px')};
      padding: 10px;
      padding-right: 50px;
      box-shadow: 0 2px 3px 0 rgba(34, 36, 38, 0.15);
      border-color: #96c8da;
      border-top-width: 1px;
      border-right-width: 1px;
      border-bottom-width: 1px;
      border-left-width: 1px;
      border-style: solid;
    `

    const TextInputContainer = styled.div`
      display: flex;
      flex-wrap: wrap;
      align-items: center;
    `

    const SelectedPill = styled.div`
      margin: 2px;
      padding-top: 2px;
      padding-bottom: 2px;
      padding-left: 8px;
      padding-right: 8px;
      display: inline-block;
      word-wrap: none;
      background-color: #ccc;
      border-radius: 2px;
    `

    const SelectedPillContentWrap = styled.div`
      display: grid;
      grid-gap: 6px;
      grid-auto-flow: column;
      align-items: center;
    `

    const SelectedPillX = styled.button`
      cursor: pointer;
      line-height: 0.8;
      border: none;
      background-color: transparent;
      padding: 0;
      font-size: 16px;
    `

    const TextInput = styled.input`
      border: none;
      margin-left: 6px;
      flex: 1;
      font-size: 14px;
      min-height: 27px;
    `

    return (
      <MultiDownshiftContainer>
        <h1 style={{textAlign: 'center'}}>Multi-selection example</h1>
        <MultiDownshift
          onChange={this.handleChange}
          itemToString={this.itemToString}
        >
          {({
            getInputProps,
            getToggleButtonProps,
            getMenuProps,
            // note that the getRemoveButtonProps prop getter and the removeItem
            // action are coming from MultiDownshift composibility for the win!
            getRemoveButtonProps,
            removeItem,

            isOpen,
            inputValue,
            selectedItems,
            getItemProps,
            highlightedIndex,
            toggleMenu,
          }) => (
            <div style={{width: 500, margin: 'auto', position: 'relative'}}>
              <Dropdown
                onClick={() => {
                  toggleMenu()
                  !isOpen && this.input.current.focus()
                }}
              >
                <TextInputContainer>
                  {selectedItems.length > 0 &&
                    selectedItems.map(item => (
                      <SelectedPill key={item.id}>
                        <SelectedPillContentWrap>
                          <span>{item.name}</span>
                          <SelectedPillX {...getRemoveButtonProps({item})}>
                            𝘅
                          </SelectedPillX>
                        </SelectedPillContentWrap>
                      </SelectedPill>
                    ))}
                  <TextInput
                    {...getInputProps({
                      ref: this.input,
                      onKeyDown(event) {
                        if (event.key === 'Backspace' && !inputValue) {
                          removeItem(selectedItems[selectedItems.length - 1])
                        }
                      },
                    })}
                    placeholder={
                      selectedItems.length < 1 ? 'Select a value' : ''
                    }
                  />
                </TextInputContainer>
                <ControllerButton
                  {...getToggleButtonProps({
                    // prevents the menu from immediately toggling
                    // closed (due to our custom click handler above).
                    onClick(event) {
                      event.stopPropagation()
                    },
                  })}
                >
                  <ArrowIcon isOpen={isOpen} />
                </ControllerButton>
              </Dropdown>
              <Menu {...getMenuProps({isOpen})}>
                {isOpen
                  ? getItems(inputValue).map((item, index) => (
                      <Item
                        key={item.id}
                        {...getItemProps({
                          item,
                          index,
                          isActive: highlightedIndex === index,
                          isSelected: selectedItems.includes(item),
                        })}
                      >
                        {item.name}
                      </Item>
                    ))
                  : null}
              </Menu>
            </div>
          )}
        </MultiDownshift>
      </MultiDownshiftContainer>
    )
  }
}

export default MultiDropdownApp
