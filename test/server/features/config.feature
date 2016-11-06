Feature: You should be able to define a config file

Scenario: You should be able to create a config file
  Given an application name of {note-and-vote}
  When I create a configuration file
  Then a configuration file should be created
  And the configuration file should be named {note-and-vote}
  And the configuration version should be {0.0.0}

Scenario: You should be able to add a property to a config file
  Given an empty configuration file named {note-and-vote}
  And a property called {session.key} with a value of {abc123}
  When I add a property called {vendor.key} with a value of {bbb}
  Then the configuration file should have a property called {vendor.key} with a value of {bbb}
  And the configuration version should be {0.1.0}

Scenario: You should be able to add a property to a config file
  Given a property called {vendor.key} with a value of {abc123}
  And an existing configuration file named {note-and-vote}
  When I add a property called {vendor.key} with a value of {bbb}
  Then the configuration file should have a property called {vendor.key} with a value of {bbb}
  And the configuration version should be {0.0.1}

Scenario: You should be able to delete a property from a config file
  Given a property called {vendor.key} with a value of {abc123}
  And an existing configuration file named {note-and-vote}
  When I delete a property called {vendor.key}
  Then the configuration file should not have a property called {vendor.key} with a value of {bbb}
  And the configuration version should be {1.0.0}

Scenario: You should be able to flatten the config file
  Given a property called {vendor.key} with a value of {abc123}
  And an existing configuration file named {note-and-vote}
  When I flatten the config
  Then the flattened file should have a property called {vendor.key} with a value of {abc123}

Scenario: You should be able to import a configuration file
  Given a property called {session.key} with a value of {abc123}
  And an existing configuration file named {note-and-vote}
  And an empty configuration file named {staging}
  When I import {note-and-vote} inside the {staging} configuration file
  Then the configuration should have an import of {note-and-vote} with a version of {0.0.0}

Scenario: Imports should not overwrite things explicitly defined in the file
  Given a property called {session.key} with a value of {abc123}
  And an existing configuration file named {note-and-vote}
  And a property called {session.key} with a value of {bbb}
  And an imported configuration file of {note-and-vote}
  And an existing configuration file named {staging}
  When I flatten the config
  Then the flattened file should have a property called {session.key} with a value of {bbb}

Scenario: Importing two files with the same property should throw an error
  Given a property called {session.key} with a value of {abc123}
  And an existing configuration file named {note-and-vote}
  And an existing configuration file named {staging}
  And an imported configuration file of {note-and-vote}
  And an imported configuration file of {staging}
  And an existing configuration file named {conflict}
  When I validate the configuration
  Then I should receive an error
  And the {note-and-vote} import should be in error
  And the {staging} import should be in error
