import React from 'react';
import All from './all';
import ApiCallComponent from './ApiCallComponent';

import './style.css'; // Import your styles

function App() {
  return (
    <div className="finance-app-container">
      
      
      <main className="finance-app-content">
        <div className="components-container">



        <table>
  <tbody>
    <tr>
      <td><ApiCallComponent /></td>
      <td style={{ verticalAlign: "bottom" }}><All style={{ verticalAlign: "bottom"}} /></td>
    </tr>
  </tbody>
</table>

          
          
          {/* Add more components for your finance app here */}
        </div>
      </main>
      <footer className="finance-app-footer">
        {/* Add footer content here */}
      </footer>
    </div>
  );
}

export default App;
