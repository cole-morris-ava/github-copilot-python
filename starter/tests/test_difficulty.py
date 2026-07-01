import os
import sys
import unittest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import app


class DifficultyTests(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()

    def count_clues(self, puzzle):
        return sum(1 for row in puzzle for cell in row if cell != 0)

    def test_easy_difficulty_returns_40_clues(self):
        response = self.client.get('/new?difficulty=easy')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(self.count_clues(data['puzzle']), 40)

    def test_medium_difficulty_returns_35_clues(self):
        response = self.client.get('/new?difficulty=medium')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(self.count_clues(data['puzzle']), 35)

    def test_hard_difficulty_returns_30_clues(self):
        response = self.client.get('/new?difficulty=hard')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(self.count_clues(data['puzzle']), 30)


if __name__ == '__main__':
    unittest.main()
