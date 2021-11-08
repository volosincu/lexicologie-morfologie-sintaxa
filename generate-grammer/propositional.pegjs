

PROP = 
    ws @proposition ws

ws "whitespace" = [ \t\n\r]*

proposition
  = subject ws predicat ws prepositiongroup? object ws? prepositiongroup? object?
   / object ws predicat ws prepositiongroup? subject

subject
    = sequence:("subject")
    { return sequence; }

predicat
    = sequence:("predicat")
    { return sequence; }

object
    = sequence:("object")
    { return sequence; }

prepositiongroup
    = on ws

on 
    = sequence:("on")
    { return sequence; }

string "string"
  = quotation_mark chars:char* quotation_mark { return chars.join(""); }


quotation_mark
  = '"'

char
  = unescaped
  / escape
    sequence:(
        '"'
      / "\\"
      / "/"
      / "b" { return "\b"; }
      / "f" { return "\f"; }
      / "n" { return "\n"; }
      / "r" { return "\r"; }
      / "t" { return "\t"; }
      / "u" digits:$(HEXDIG HEXDIG HEXDIG HEXDIG) {
          return String.fromCharCode(parseInt(digits, 16));
        }
    )
    { return sequence; }

escape
  = "\\"

unescaped
  = [^\0-\x1F\x22\x5C]

DIGIT  = [0-9]
HEXDIG = [0-9a-f]i

