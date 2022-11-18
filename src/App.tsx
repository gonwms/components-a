// import { Table } from 'components/Table/Table';
// import Table2 from 'components/Table2/Table2';
// import Table3 from 'components/Table3/Table3';
// import TreeMenu1 from 'components/TreeMenu1/TreeMenu1';
import TreeMenu3 from 'components/TreeMenu3/TreeMenu3';

// import TreeMenu2 from 'components/TreeMenu2/TreeMenu2';
import Select from './components/Select/Select';
import Table4 from './components/Table4/Table4';

function App() {
   return (
      <div>
         {/* <h3>Tree Menu 1. </h3>s
       <p>Al cerrarse se cierran las subcategorias</p>
       <TreeMenu1 />
       <hr /> */}

         {/* <Table />
       <Table2 /> */}
         {/* <h3>Tree Menu 2 </h3>
       <p>Las categorias mantienen su estado</p>
       <TreeMenu2 />
       <hr /> */}

         {/* <h3>Tabla Sortable</h3>
       <Table3 />
       <hr /> */}
         <Select
            title="Salsa"
            options={[
               'Lorem ipsum',
               'dolor sit amet',
               'consectetur',
               'adipisicing',
            ]}
         />
         {/* <Table4 />
            <TreeMenu3 /> */}
      </div>
   )
}

export default App
