import { createGlobalStyle } from 'styled-components'

export const GlobalStyles = createGlobalStyle`
    *,
    *::after,
    *::before {
        box-sizing: border-box;
        margin: 0;
    }
    body {
        background: ${({ theme }) => theme.bg2};
        color: ${({ theme }) => theme.text};
        font-family: 'Roboto', sans-serif;
        letter-spacing: .6px;
        font-size: 1em;
        margin: 0;
        padding: 0;
    }
    p {
        opacity: 0.6;
        line-height: 1.5;
    }
    h2 {color: ${({ theme }) => theme.primary};}
 
    .ag-cell-wrap-text {
      word-break: break-word;
    }

    .ag-header-cell-label {
      justify-content: center;
    }

    .ag-theme-alpine {
        //--ag-header-foreground-color: white;
        --ag-header-background-color: ${({ theme }) => theme.bg};
        //--ag-header-background-color: ${({ theme }) => theme.primary2};
        //--ag-selected-row-background-color: rgb(255, 255, 255); 
        --ag-selected-row-background-color: ${({ theme }) => theme.textInvert2};
        --ag-odd-row-background-color: ${({ theme }) => theme.textInvert};
        --ag-row-hover-color: ${({ theme }) => theme.textInvert2};
        --ag-grid-size: 4px;
        //--ag-list-item-height: 20px;    
    }
     
    table {
        border-collapse: collapse; 
        width: 100%;
        margin-top: 0;
      }
      
      table td,
      table th {
  
        padding: 6px;
        white-space: nowrap;
        overflow-y: auto;
        overflow-x: hidden;
        text-overflow: ellipsis;
      }
      
      table tr:nth-child(even) {
        background-color: ${({ theme }) => theme.textInvert}; 
      }
      
      table tr:hover {
        background-color: ${({ theme }) => theme.textInvert2};
      }
      
      table th {
        border-bottom: 1px solid;
        text-align: center;
        opacity: 0.6;
  
      }

    .tab-list {
      //border-bottom: 1px solid rgba(0, 0, 0, 0.125);
      padding-left: 0;
      font-size: .95rem;
    }

    .tab-list-item {
      display: inline-block;
      list-style: none;
      margin-bottom: -1px;
      padding: 0.5rem 0.75rem;
      cursor: pointer;
      color: ${({ theme }) => theme.textFade}; 
      background-color: ${({ theme }) => theme.textInvert}; 
    }

    .tab-list-active {
      color: ${({ theme }) => theme.text};
      background-color: ${({ theme }) => theme.bg};
      border: solid #ccc;
      border-width: 1px 1px 0 1px;
      font-weight: bold;
      cursor: default;
    }

    .tab-content {
      height: calc(100vh - 25rem);
    }
    
`
