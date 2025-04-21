class Exam < ApplicationRecord
  has_many :user_exams
  has_many :users, through: :user_exams

  validates :name, presence: true
  validates :video_url, presence: true
end
