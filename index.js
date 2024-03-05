var database = null;

const
  echoTestButton = document.querySelector("#echo-test-button"),
  selfTestButton = document.querySelector("#self-test-button"),
  openDbButton = document.querySelector("#open-db-button"),
  createTableButton = document.querySelector("#create-table-button"),
  insertRecordButton = document.querySelector("#insert-record-button"),
  updateRecordButton = document.querySelector("#update-record-button"),
  searchRecordButton = document.querySelector("#search-record-button"),
  deleteRecordButton = document.querySelector("#delete-record-button"),
  showAllRecordsButton = document.querySelector("#show-all-records-button"),
  deleteAllRecordsButton = document.querySelector("#delete-all-records-button");


echoTestButton.onclick = function () {
    echoTest();
};

function echoTest() {
    window.sqlitePlugin.echoTest(function () {
      showMessage('Echo test OK');
    }, function (error) {
      showMessage('Echo test ERROR: ' + error.message);
    });
};

selfTestButton.onclick = function () {
    selfTest();
  };
  

function selfTest() {
    window.sqlitePlugin.selfTest(function () {showMessage('Self test OK');}, 
    function (error) {showMessage('Self test ERROR: ' + error.message);});
};

function showMessage(message) {
    document.getElementById("status").innerHTML = message + "<br>";
  };
  
  // Show message in element with id 'status'
  function showMessageAppend(message) {
    document.getElementById("status").innerHTML += message + "<br>";
};

openDbButton.onclick = function () {
    openDatabase();
};

function openDatabase(){
    database = window.sqlitePlugin.openDatabase({ name: 'university.db', location: 'default' }, function (db) {
        showMessage('Database OK');
      }, function (error) {
        showMessage('Open database ERROR: ' + JSON.stringify(error));
      });    
}

createTableButton.onclick = function () {
    createTable();
};

function createTable(){
    database.transaction(function (transaction) {
        transaction.executeSql('CREATE TABLE IF NOT EXISTS Student (sid, sname, address)');
      }, function (error) {
        showMessage('Transaction ERROR: ' + error.message);
      }, function () {
        showMessage('Table is created');
    });    
}

insertRecordButton.onclick = function () {
    var sid = document.getElementById("inputId").value;
    var sname = document.getElementById("inputName").value;
    var address = document.getElementById("inputAddress").value;
    insertRecord(sid, sname, address);
};

function insertRecord(sid,sname,address){
    database.transaction(function (transaction) {
        var query = "INSERT INTO Student (sid, sname, address) VALUES (?,?,?)";
        transaction.executeSql(query, [sid, sname, address], function (transaction, res) {
          showMessage("insertId: " + res.insertId);
          showMessageAppend("rowsAffected: " + res.rowsAffected + " (Should be 1)");
        },
          function (transaction, error) {
            showMessage('INSERT error: ' + error.message);
          });
      }, function (error) {
        showMessage('Transaction error: ' + error.message);
      }, function () {
        showMessageAppend('Record inserted');
      });    
}

updateRecordButton.onclick = function () {
    var sid = document.getElementById("inputId").value;
    var sname = document.getElementById("inputName").value;
    var address = document.getElementById("inputAddress").value;
    updateRecord(sid, sname, address);
};

function updateRecord(sid, sname,address){
    database.transaction(function (transaction) {

        var query = "UPDATE Student SET sname = ?, address = ? WHERE sid = ?";
    
        transaction.executeSql(query, [sname, address, sid], function (transaction, res) {
          showMessage("insertId: " + res.insertId);
          showMessageAppend("rowsAffected: " + res.rowsAffected);
    },
      function (transaction, error) {
        showMessage('UPDATE error: ' + error.message);
      });
  }, function (error) {
    showMessage('Transaction error: ' + error.message);
  }, function () {
    showMessageAppend('Update complete');
  });
}


showAllRecordsButton.onclick = function () {
    showAllRecords();
};

function showAllRecords(){
    database.transaction(function (transaction) {
        var query = "SELECT sid, sname, address FROM Student";
    
        transaction.executeSql(query, [], function (transaction, resultSet) {
          if (resultSet.rows.length === 0)
            showMessage('No record found');
          else {
            var x = 0;
            for (; x < resultSet.rows.length; x++) {
              if (x === 0) {
                showMessage("SID: " + resultSet.rows.item(x).sid + ", Name: " + resultSet.rows.item(x).sname + ", Address: " + resultSet.rows.item(x).address);
              }
              else {
                showMessageAppend("SID: " + resultSet.rows.item(x).sid + ", Name: " + resultSet.rows.item(x).sname + ", Address: " + resultSet.rows.item(x).address);
              }
            }
            showMessageAppend(x + " record(s) found");
          }
        },
          function (transaction, error) {
            showMessage('SELECT error: ' + error.message);
          });
      }, function (error) {
        showMessage('Transaction error: ' + error.message);
      }, function () {
        showMessageAppend('Show all records completed');
  });  
}
  
searchRecordButton.onclick = function () {
    var sid = document.getElementById("searchId").value;
    searchById(sid);
  };

  

function searchById(sid){
    database.transaction(function (transaction) {
        var query = "SELECT sid, sname, address FROM Student WHERE sid = ?";
    
        transaction.executeSql(query, [sid], function (transaction, resultSet) {
          if (resultSet.rows.length === 0)
            showMessage('No record found');
          else
            showMessage("SID: " + resultSet.rows.item(0).sid + ", Name: " + resultSet.rows.item(0).sname + ", Address: " + resultSet.rows.item(0).address);
        },
          function (transaction, error) {
            showMessage('SELECT error: ' + error.message);
          });
      }, function (error) {
        showMessage('Transaction error: ' + error.message);
      }, function () {
        showMessageAppend('Search record completed');
    });    
}
  

deleteRecordButton.onclick = function () {
    var sid = document.getElementById("searchId").value;
    deleteById(sid);
  };
  

function deleteById(sid) {
    database.transaction(function (transaction) {
      var query = "DELETE FROM Student WHERE sid = ?";
  
      transaction.executeSql(query, [sid], function (transaction, res) {
        showMessage("removeId: " + res.insertId);
      showMessageAppend("rowsAffected: " + res.rowsAffected);
    },
      function (transaction, error) {
        showMessage('DELETE error: ' + error.message);
      });
  }, function (error) {
    showMessage('Transaction error: ' + error.message);
  }, function () {
    showMessageAppend('Deletetion completed');
  });
};
  
deleteAllRecordsButton.onclick = function () {
    deleteAllRecords();
  };
  
function deleteAllRecords() {
    database.transaction(function (transaction) {
      var query = "DELETE FROM Student";
  
      transaction.executeSql(query, [], function (transaction, res) {
        showMessage("removeId: " + res.insertId);
        showMessageAppend("rowsAffected: " + res.rowsAffected);
      },
        function (transaction, error) {
          showMessage('DELETE error: ' + error.message);
        });
    }, function (error) {
      showMessage('Transaction error: ' + error.message);
    }, function () {
      showMessage('Deletion of All Records Completetd');
    });
};

document.addEventListener('deviceready', function () {
    echoTest();
    selfTest();
    openDatabase();
});

  

