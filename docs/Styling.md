# Styling

All elements can be styled individually.

The program uses JSS (along with the nested plugin) to render the styles
dinamically .

The process consists of these steps:

1. JSS are initialized along with the program and a style tag is injected into
	 the head of the document.

2. The styles are built in Elm using the `style`, `selector`, `pseudo`, etc.
	 functions which take a list two element tuples (of CSS property and value)
	 for example: `[ ( "display", "flex" ) ]` and added to an element.

3. A unique string is generated from the styles using `JSON.stringify`

4. If there are no actual CSS styles with that unique string then styles are
	 transformed to a nested style object and passed to JSS to create rule from
	 them while giving it a class name.

5. If there are actual CSS styles with that unique string get the rule
	 associated with it.

6. Add the class of the rule to the element.

The rules once created never get destroyed, it is because an application has a
finite number of CSS rules (that's why it can be pre generated in many cases)
from which the following conclusions can be reached:

- all rules will be generated and cached eventually
- cached rules can be reused freely
- if the user only checks one page the other rules will not be generated
