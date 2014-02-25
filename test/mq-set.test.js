'use strict';

    Feature: A simple set than allows me to add and remove keys and without duplication.

      Scenario: Add a item to the set
        Given I have a new set
          And I have a key
         When I add the key to the set
         Then The set should have the key

      Scenario: Remove an existing item
        Given I have a new set
          And I have a key
          And I add the key to the set
         When I remove the key
         Then The set should not have the key


    /^I have a new set$/
    this.set = mqSet.new();

    /^I have a key$/
    this.key = 'testing';

    /^I add the key to the set$/
    this.set.add(this.key);

    /^The set should have the key$/
    this.set.has(this.key);

/^I remove the key from the


describe('on mqSet component', function() {



});
