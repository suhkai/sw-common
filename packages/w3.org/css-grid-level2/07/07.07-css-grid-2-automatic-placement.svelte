<form>
    <label for="firstname">First name:</label>
    <input type="text" id="firstname" name="firstname" />
    <label for="lastname">Last name:</label>
    <input type="text" id="lastname" name="lastname" />
    <label for="address">Address:</label>
    <input type="text" id="address" name="address" />
    <label for="address2">Address 2:</label>
    <input type="text" id="address2" name="address2" />
    <label for="city">City:</label>
    <input type="text" id="city" name="city" />
    <label for="state">State:</label>
    <select type="text" id="state" name="state">
        <option value="WA">Washington</option>
    </select>
    <label for="zip">Zip:</label>
    <input type="text" id="zip" name="zip" />

   

    <div id="buttons">
        <button id="cancel">Cancel</button>
        <button id="back">Back</button>
        <button id="next">Next</button>
    </div>

    <label class="department-block" for="department">Department:</label>
    <select class="department-block" id="department" name="department" multiple>
        <option value="finance">Finance</option>
        <option value="humanresources">Human Resources</option>
        <option value="marketing">Marketing</option>
    </select>
</form>

<style type="text/css">
    * {
        box-sizing: border-box;
    }
    form {
        display: grid;
        /* Define three columns, all content-sized,
         and name the corresponding lines. */
        grid-template-columns: [labels] auto [controls] auto [oversized] auto;
        grid-auto-flow: row dense;
        column-gap: 1ch;
        align-items: center;
    }
    form > label {
        /* Place all labels in the "labels" column and
         automatically find the next available row. */
        grid-column: labels;
        grid-row: auto;
    }
    form > input,
    form > select {
        /* Place all controls in the "controls" column and
         automatically find the next available row. */
        grid-column: controls;
        grid-row: auto;
    }

    .department-block {
        /* Auto place this item in the "oversized" column
         in the first row where an area that spans three rows
         won’t overlap other explicitly placed items or areas
         or any items automatically placed prior to this area. */
        grid-column: oversized;
        /*grid-row: span 3;*/
    }

    #department {
        grid-row: span 3;
        align-self: stretch;
        border: 4px solid red;
    }

    /* Place all the buttons of the form
       in the explicitly defined grid area. */
    #buttons {
        grid-row: auto;

        /* Ensure the button area spans the entire grid element
         in the inline axis. */
        grid-column: 1 / -1;
        text-align: end;
    }
</style>
