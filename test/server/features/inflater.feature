Feature: A config should be able to have its imports inflated

Scenario: A config with an import should return a new object with imports inflated
  Given a property called {session.key} with a value of {abc123}
  And an existing configuration file named {note-and-vote}
  And an uninflated import named {note-and-vote}
  And an existing inflatable configuration file named {staging}
  When I inflate the configuration
  Then the configuration should have an import of {note-and-vote} with a version of {0.0.0}
  And the import of {note-and-vote} should contain a property called {session.key} with a value of {abc123}
  And the import of {note-and-vote} should be the {1}st import

Scenario: A config with no imports should return a non-inflatable config with the same properties
  Given an existing inflatable configuration file named {note-and-vote}
  When I inflate the configuration
  Then the configuration version should be {0.0.0}
  And the configuration file should be named {note-and-vote}
  And the configuration should have no imports
  And the configuration should not be inflatable
