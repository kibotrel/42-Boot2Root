# Introduction

Two files are in its `home` directory... Once again a `README` and a binary called `bomb`.

```
  $> cat README
  Diffuse this bomb!
  When you have all the password use it as "thor" user with ssh.

  HINT:
  P
  2
  b

  o
  4

  NO SPACE IN THE PASSWORD (password is case sensitive).    
```

We'll use [Hopper](https://www.hopperapp.com/index.html) and [`gdb`](https://linux.die.net/man/1/gdb) to get through this challenge.

The program consists of a set of string checks waiting for us to input the correct value each time.
Using Hopper we see that there are 6 functions named `phaseX` with X. There's also a ``secret_phase`` but we'll come back to it later.

# Phase 1, String comparison.

Hopper gives us the following code:

```C
int phase_1(int arg0) {
  eax = strings_not_equal(arg0, "Public speaking is very easy.");
  if (eax != 0x0) {
     eax = explode_bomb();
  }
  return eax;
}
```

> Pretty straight forward, simply checks if our input is `Public speaking is very easy.`.

# Phase 2, Factorials.

Using Hopper we can recreate the function:

```C
int phase_2() {
  inputs = read_six_numbers(stdin); // int[6]
  if inputs.len() != 6
    explode_bomb();
  int factorials[6] = {1, 2, 3, 4, 5, 6}; // stored in esi register
  
  int i = 1;
  do {
    factorial = factorials[i - 1];
    factorials[i] *= factorials[i - 1];
    if (inputs[i] != factorial)
      explode_bomb();
  } while (i <= 5)
  return 0;
}
```

> For this one we need to input the result of factorials from 1 to 6. So answer is `1 2 6 24 120 720`.

# Phase 3, Switch case.

Hopper gives us the following code:

```C
int phase_3() {
  int rtn = scanf(stdin, "%d %c %d", &first_int, &my_char, &second_int);
  if rtn <= 2
    explode_bomb();
  if (first_int < 7)
    switch case (first_int)
      case 0:
        cmp_char = 'q';
        if (second_int != 777) {
          eax = explode_bomb();
        }
        else {
          if (cmp_char != my_char) {
            eax = explode_bomb();
          }
        }
        break;
      case 1:
        cmp_char = 'b';
        if (second_int != 214) {
          explode_bomb();
        }
        else {
          if (cmp_char != my_char) {
            eax = explode_bomb();
          }
        }
        break;
      ... // There are 6 more cases but they are not interesting.
  }
  else
    explode_bomb();
  return 0;
}
```

> This one waits for one number, a character and another number to be input. There are multiple possible answers, We take the first one because the hint for this phase is `b`. So let's use `1 b 214`.

# Phase 4, Fibonacci sequence.

Using Hopper we can recreate the function:

```C
int func4(int fibo_index) {
  int fibo1;
  if (fibo_index > 1) {
    fibo1 = func4(ebx - 1);
    fibo2 = func4(ebx - 2);
    fibo1 = fibo1 + fibo2;
  }
  else {
    fibo1 = 0x1;
  }
  return fibo1;
}

int phase_4() {
  if ((sscanf(stdin, "%d", &fibo_index) == 1) && (fibo_index > 0)) {
    int fibo55 = func4(fibo_index);
    if (fibo555 != 55) {
      eax = explode_bomb();
    }
  }
  else {
    explode_bomb();
  }
  return eax;
}
```

> This one takes a int as input and returns a term in the Fibonacci sequense corresponding to that index. It checks an index that gives `55`, which is the 10th index. However `func4()` stops at index 1 so the sequensse starts with `[1, 1]` and not `[0 , 1]`. So we need to subscract one itteration from our guess to find the correct value which is `9`.

# Phase 5, Cipher.

Using Hopper we can recreate the function:

```C
void phase_5() {
  read_input(stdin, &str);
  if (strlen(str) != 6) {
    explode_bomb();
  }
  else {
    int i = 0;
    char *indexMe = "isrveawhobpnutfg";
    do {
      str[i] = indexMe[str[i] & 0xf];
      i++;
    } while (edx <= 5);
    if strcmp(str, "giants" != 0) {
      explode_bomb();
    }
  }
  return;
}
```
> It uses each character of the string we put in and does a [binary AND](https://en.wikipedia.org/wiki/Bitwise_operation) with `0xf` with them which creates a number below `16` used as index in `isrveawhobpnutfg`. The newly constructed string must then be equal to `giants`.

We did a quick script to get the possible combinaisons that matches the result.

```python
#!/usr/bin/python3
index = 'isrveawhobpnutfg'

for i in 'abcdefghijklmnopqrstuvwxyz':
  if index[ord(i) & 0xf] in 'giants':
    print("{} : {}".format(index[ord(i) & 0xf], i))
```

If we run the script, it will prompts us which letter maps to each of the ones forming the word `giants`.

```shell
  $> python3 phase5.py
  s : a
  a : e
  n : k
  t : m
  g : o
  i : p
  s : q
  a : u
```
> As we can see, since `s` and `a` have two valid mapped characters, there are 4 possible solutions: `opekma`, `opekmq`, `opukma` and `opukmq`. After trying them all, we see that `opekmq` is the answer.

# Phase 6, Sorting values.

Using Hopper we can tell:

- `phase_6()` takes six ints and checks that they're less than 6.
- Permutate data in `esi` using our input then checks if that data is in decreasing order.
- `esi` registery holds what's at address `0x804b26c`.

Now let's use `gdb` to figure out which order we need to set our inputs.

```gdb
  $> gdb -q bomb
  Reading symbols from /home/laurie/bomb...done.
  (gdb) b main
  Breakpoint 1 at 0x80489b7: file bomb.c, line 36.
  (gdb) r
  Starting program: /home/laurie/bomb

  Breakpoint 1, main (argc=1, argv=0xb7fd0ff4) at bomb.c:36
  36  bomb.c: No such file or directory.
  (gdb) x/20x 0x804b26c-0x40
  0x804b22c <array>:    0x67667475	0x000001b0	0x00000006	0x00000000
  0x804b23c <node5>:    0x000000d4	0x00000005	0x0804b230	0x000003e5
  0x804b24c <node4+4>:  0x00000004	0x0804b23c	0x0000012d	0x00000003
  0x804b25c <node3+8>:  0x0804b248	0x000002d5	0x00000002	0x0804b254
  0x804b26c <node1>:    0x000000fd	0x00000001	0x0804b260	0x000003e9
  (gdb) x/20x 0x804b26c-0x42
  0x804b22a <arra>:     0x74756e70	0x01b06766	0x00060000	0x00000000
  0x804b23a <node6+10>: 0x00d40000	0x00050000	0xb2300000	0x03e50804
  0x804b24a <node4+2>:  0x00040000	0xb23c0000	0x012d0804	0x00030000
  0x804b25a <node3+6>:  0xb2480000	0x02d50804	0x00020000	0xb2540000
  0x804b26a <node2+10>: 0x00fd0804	0x00010000	0xb2600000	0x03e90804
```
> We can see 6 nodes and their values. All we have to do is to tell their descending order depending on which value they hold. The answer is, indeed, `4 2 6 3 1 5`.

Now that we have all the passwords, we need to concatenate them into the final result which is:

```
Publicspeakingisveryeasy.126241207201b2149opekmq426315
```
> However it doesn't work, for some reason we need to swap third-to-last and second-to-last characters. [Source](https://stackoverflow.com/c/42network/questions/664).

We now have another credentials pair: `thor:Publicspeakingisveryeasy.126241207201b2149opekmq426135`.
