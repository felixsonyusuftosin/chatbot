import aiml
import xml.etree.ElementTree as ET
class AI():
    def __init__(self):
        self.tree = ET.parse('main-page.xml')
        self.kernel = aiml.Kernel()
        self.kernel.learn("startup.xml")
        self.kernel.respond('load aiml b')
    def test(self):
        while True:
            print self.kernel.respond(raw_input("Ener message"))

    def xlreader(self):
        root = self.tree.getroot()
        for child in root:
            print child.tag, child.attrib

testcase = AI()
testcase.xlreader()
