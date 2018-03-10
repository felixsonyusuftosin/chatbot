
import os
'''
ClASS DEFINITION
Here we are going to define what a python class is
the instantiation of a class
Define class methods and properties
.................>CONTEXT-----------------
Races: Every race of humans belong to a class human being
there are several races in the human specy
different characteristic differentiates people by race
'''
'''
frank = human_being(120, 'black', 5.7, 35)
bob = human_being(85, 'brown ', 6.7, 25)
mike = human_being(140, 'black ', 6.7, 35)
Sarah = human_being(50, 'black ', 5.7, 15)
Eve = human_being(90, 'white ', 5.7, 35)
Adam = human_being(80, 'bk ', 5.7, 35)
Chris = human_being(78, 'black ', 5.7, 35)
'''
'''
STEPS TO RUN
python
from classTraining import *
<var> = hman_being( ** options)
<var>.calculate_bmi()
'''


# class human being defines base class for all racew human being


class human_being:
    # class definition takes in one param {self} which is a reference to itself
    # initialize class
    def __init__(self, weight, color, height, age, name):
        self.weight = float(weight)
        self.color = color
        self.height = float(height)
        self.age = float(age)
        self.arms = 2
        self.body = 1
        self.head = 1
        self.name = name

    def race(self):
        if (self.color.lower().strip() == 'black'):
            print ('he is a blak man')
            return 'black'
        if (self.color.lower().strip() == 'brown'):
            print ('he is an asian')
            return 'asian'
        if (self.color.lower().strip() == 'white'):
            print ('he is an asian')
            return 'white'
    # defines a function that measures the BMI and gives recommendation
    ''' Assumptions a dfit BMI is between 5 and 7
     anything below means starvation and anythoig above means overweight
     For calclationg bMI  -  weight/Height * 1/(Age)Square * 10
     '''

    def calculate_bmi(self):
        reports = {
            'overweight': {
                'name': self.name,
                'advice': 'Hey you are overweight perhaps you are eating too much or you are depressed',
                'report': 'You need to exercise, to bring your BMI to 5',
                'score': 0.0,

            },
            'starvation': {
                'name': self.name,
                'advice': 'Hey whats the problem broke or you cant eat?? Food is good',
                'report': 'You need to eat more you arew starving',
                'score': 0.0,
            },
            'optimal': {
                'name': self.name,
                'advice': 'Hey good job you are healthy ',
                'report': 'Recomend exercise and keep doing what you are doing',
                'score': 0.0,
            },
        }
        bmi = float(self.weight / self.height * self.height)
        print 'your bmi is {}'.format(bmi)
        if bmi >= 5 and bmi <= 7:
            yourReport = reports['optimal']
        if bmi < 5:
            yourReport = reports['starvation']
        if bmi > 7:
            yourReport = reports['overweight']
        yourReport['score'] = bmi

def generate_reports():
    # generates directory and tells oursystem  to user our current path
    interest = [human_being(120, 'black', 5.7, 35, 'Frank'),
                human_being(85, 'brown ', 6.7, 25, 'Bob'),
                human_being(140, 'black ', 6.7, 35, 'Mike'),
                human_being(50, 'white ', 5.7, 15, 'Sarah'),
                human_being(90, 'white ', 5.7, 35, 'Eve'),
                human_being(80, 'bk', 5.7, 35, 'Adam'),
                human_being(78, 'black ', 5.7, 35, 'Grace')
                ]
    for i in interest:
        try:
            f = open('reports.txt', 'a')
        except IOError:
            f = open('reports.txt', 'w+')
        report = i.calculate_bmi()
        race = i.race()
        message = '{}, |  this is a {} man'.format(report, race)
        f.write(message)
        f.close()
generate_reports()
