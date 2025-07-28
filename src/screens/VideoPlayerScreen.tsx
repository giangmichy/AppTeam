import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Modal,
  ScrollView,
  TextInput,
  Alert,
  Animated,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { COLORS } from '../constants/colors';

const { width, height } = Dimensions.get('window');

type RootStackParamList = {
  VideoPlayer: { videoUrl: string; title: string; courseId?: string; lessonId?: string };
  CourseDetail: { courseId: string };
};

type VideoPlayerScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'VideoPlayer'>;

// Mock quiz data
const mockQuizData = {
  id: 'quiz-1',
  title: 'Kiểm tra kiến thức - Biến và Kiểu dữ liệu Python',
  description: 'Hãy kiểm tra hiểu biết của bạn về những khái niệm vừa học',
  questions: [
    {
      id: 'q1',
      question: 'Biến trong Python được khai báo như thế nào?',
      type: 'multiple-choice',
      options: [
        'var x = 10',
        'int x = 10', 
        'x = 10',
        'declare x = 10'
      ],
      correctAnswer: 2,
      explanation: 'Python không cần từ khóa khai báo biến, chỉ cần gán giá trị trực tiếp.'
    },
    {
      id: 'q2',
      question: 'Kiểu dữ liệu nào sau đây KHÔNG phải là kiểu cơ bản trong Python?',
      type: 'multiple-choice',
      options: [
        'int',
        'string',
        'boolean', 
        'array'
      ],
      correctAnswer: 3,
      explanation: 'Python sử dụng list thay vì array. Array là khái niệm trong các ngôn ngữ khác.'
    },
    {
      id: 'q3',
      question: 'Hàm type() trong Python dùng để làm gì?',
      type: 'multiple-choice',
      options: [
        'Chuyển đổi kiểu dữ liệu',
        'Kiểm tra kiểu dữ liệu của biến',
        'Xóa biến',
        'Tạo biến mới'
      ],
      correctAnswer: 1,
      explanation: 'Hàm type() trả về kiểu dữ liệu của một biến hoặc giá trị.'
    },
    {
      id: 'q4',
      question: 'Chuỗi "Hello World" trong Python thuộc kiểu dữ liệu nào?',
      type: 'multiple-choice',
      options: [
        'str',
        'string',
        'text',
        'char'
      ],
      correctAnswer: 0,
      explanation: 'Trong Python, chuỗi ký tự có kiểu dữ liệu là str (string).'
    },
    {
      id: 'q5',
      question: 'Giá trị nào sau đây là Boolean trong Python?',
      type: 'multiple-choice',
      options: [
        'true/false',
        'True/False',
        '1/0',
        'yes/no'
      ],
      correctAnswer: 1,
      explanation: 'Python sử dụng True và False (viết hoa chữ cái đầu) cho kiểu Boolean.'
    }
  ]
};

// Mock video data  
const mockVideoData = {
  id: 'lesson-1',
  title: 'Giới thiệu về Python - Biến và Kiểu dữ liệu',
  courseTitle: 'Lập Trình Python Từ Cơ Bản Đến Nâng Cao',
  duration: 1260, // 21 minutes in seconds
  currentTime: 0,
  playbackSpeed: 1,
  quality: '720p',
  subtitles: [
    { language: 'vi', label: 'Tiếng Việt' },
    { language: 'en', label: 'English' }
  ],
  chapters: [
    { id: 1, title: 'Giới thiệu khóa học', startTime: 0 },
    { id: 2, title: 'Cài đặt Python', startTime: 180 },
    { id: 3, title: 'Biến trong Python', startTime: 420 },
    { id: 4, title: 'Các kiểu dữ liệu cơ bản', startTime: 720 },
    { id: 5, title: 'Thực hành với ví dụ', startTime: 1020 }
  ],
  notes: [
    {
      id: '1',
      time: 120,
      content: 'Python là ngôn ngữ lập trình đơn giản và mạnh mẽ',
      timestamp: '02:00'
    },
    {
      id: '2', 
      time: 380,
      content: 'Nhớ cài đặt Python 3.8 trở lên',
      timestamp: '06:20'
    }
  ],
  hasQuiz: true,
  //quizUnlocked: false // Quiz sẽ unlock khi xem hết video
  quizUnlocked: true // Tạm thời mở khóa để test
};

// Mock learning progress data
const mockLearningProgress = {
  totalLessons: 45,
  completedLessons: 12,
  currentStreak: 7,
  totalStudyTime: 142, // minutes
  weeklyGoal: 300, // minutes
  achievements: [
    { id: 1, title: 'First Video', icon: 'play-circle', unlocked: true },
    { id: 2, title: 'Quiz Master', icon: 'trophy', unlocked: false },
    { id: 3, title: '7 Day Streak', icon: 'flame', unlocked: true },
  ]
};

const VideoPlayerScreen = () => {
  const navigation = useNavigation<VideoPlayerScreenNavigationProp>();
  const route = useRoute();
  const { t } = useTranslation();
  const { videoUrl, title, courseId, lessonId } = route.params as { videoUrl: string; title: string; courseId?: string; lessonId?: string } ;

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(mockVideoData.duration);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [selectedQuality, setSelectedQuality] = useState('720p');
  const [showSpeedModal, setShowSpeedModal] = useState(false);
  const [showQualityModal, setShowQualityModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showChaptersModal, setShowChaptersModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [notes, setNotes] = useState(mockVideoData.notes);
  
  // Quiz states
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: string]: number}>({});
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const controlsOpacity = useRef(new Animated.Value(1)).current;
  const progressRef = useRef<View>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      if (isPlaying) {
        setCurrentTime(prev => {
          const newTime = Math.min(prev + 1, duration);
          // Unlock quiz when video is 80% completed
          if (newTime >= duration * 0.8) {
            mockVideoData.quizUnlocked = true;
          }
          return newTime;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, duration]);

  useEffect(() => {
    if (showControls) {
      Animated.timing(controlsOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        if (isPlaying) {
          hideControls();
        }
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showControls, isPlaying]);

  const hideControls = () => {
    Animated.timing(controlsOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setShowControls(false));
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    setShowControls(true);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressChange = (progress: number) => {
    const newTime = (progress / 100) * duration;
    setCurrentTime(newTime);
  };

  const seekTo = (seconds: number) => {
    setCurrentTime(Math.max(0, Math.min(seconds, duration)));
  };

  const addNote = () => {
    if (newNote.trim()) {
      const note = {
        id: Date.now().toString(),
        time: currentTime,
        content: newNote.trim(),
        timestamp: formatTime(currentTime)
      };
      setNotes([...notes, note]);
      setNewNote('');
      Alert.alert('Thành công', 'Đã thêm ghi chú');
    }
  };

  const deleteNote = (noteId: string) => {
    Alert.alert(
      'Xóa ghi chú',
      'Bạn có chắc muốn xóa ghi chú này?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => setNotes(notes.filter(note => note.id !== noteId))
        }
      ]
    );
  };

  const jumpToChapter = (startTime: number) => {
    setCurrentTime(startTime);
    setShowChaptersModal(false);
  };

  // Quiz functions
  const startQuiz = () => {
    if (!mockVideoData.quizUnlocked) {
      Alert.alert('Quiz chưa mở khóa', 'Hãy xem hết video để mở khóa bài quiz này');
      return;
    }
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowQuizResults(false);
    setQuizCompleted(false);
    setShowQuizModal(true);
  };

  const selectAnswer = (questionId: string, answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < mockQuizData.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const finishQuiz = () => {
    setShowQuizResults(true);
    setQuizCompleted(true);
  };

  const calculateQuizScore = () => {
    let correct = 0;
    mockQuizData.questions.forEach(question => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    return {
      correct,
      total: mockQuizData.questions.length,
      percentage: Math.round((correct / mockQuizData.questions.length) * 100)
    };
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return COLORS.success;
    if (percentage >= 60) return COLORS.warning;
    return COLORS.danger;
  };

  const playbackSpeeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
  const qualities = ['360p', '480p', '720p', '1080p'];

  const renderVideoPlayer = () => (
    <View style={[styles.videoContainer, isFullscreen && styles.fullscreenVideo]}>
      <TouchableOpacity 
        style={styles.videoTouchArea}
        onPress={() => setShowControls(!showControls)}
        activeOpacity={1}
      >
        <View style={styles.videoPlaceholder}>
          <LinearGradient
            colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
            style={styles.videoGradient}
          >
            <View style={styles.videoCenter}>
              <Ionicons 
                name="play-circle" 
                size={80} 
                color={COLORS.white} 
                style={{ opacity: isPlaying ? 0 : 1 }}
              />
            </View>
          </LinearGradient>
        </View>
      </TouchableOpacity>

      {/* Video Controls Overlay */}
      <Animated.View 
        style={[
          styles.controlsOverlay,
          { opacity: controlsOpacity }
        ]}
        pointerEvents={showControls ? 'auto' : 'none'}
      >
        {/* Top Controls */}
        <LinearGradient
          colors={['rgba(0,0,0,0.7)', 'transparent']}
          style={styles.topControls}
        >
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
          
          <View style={styles.titleContainer}>
            <Text style={styles.videoTitle} numberOfLines={1}>
              {mockVideoData.title}
            </Text>
            <Text style={styles.courseTitle} numberOfLines={1}>
              {mockVideoData.courseTitle}
            </Text>
          </View>

          <TouchableOpacity 
            style={styles.fullscreenButton}
            onPress={() => setIsFullscreen(!isFullscreen)}
          >
            <Ionicons 
              name={isFullscreen ? "contract" : "expand"} 
              size={24} 
              color={COLORS.white} 
            />
          </TouchableOpacity>
        </LinearGradient>

        {/* Center Play Button */}
        <TouchableOpacity 
          style={styles.centerPlayButton}
          onPress={togglePlayPause}
        >
          <Ionicons 
            name={isPlaying ? "pause" : "play"} 
            size={32} 
            color={COLORS.white} 
          />
        </TouchableOpacity>

        {/* Bottom Controls */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.bottomControls}
        >
          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${(currentTime / duration) * 100}%` }
                ]} 
              />
            </View>
          </View>

          {/* Control Buttons */}
          <View style={styles.controlButtons}>
            <TouchableOpacity onPress={() => seekTo(currentTime - 10)}>
              <Ionicons name="play-back" size={24} color={COLORS.white} />
            </TouchableOpacity>

            <TouchableOpacity onPress={togglePlayPause}>
              <Ionicons 
                name={isPlaying ? "pause" : "play"} 
                size={32} 
                color={COLORS.white} 
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => seekTo(currentTime + 10)}>
              <Ionicons name="play-forward" size={24} color={COLORS.white} />
            </TouchableOpacity>

            <Text style={styles.timeText}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </Text>

            <View style={styles.rightControls}>
              <TouchableOpacity 
                style={styles.controlButton}
                onPress={() => setShowSpeedModal(true)}
              >
                <Text style={styles.speedText}>{playbackSpeed}x</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.controlButton}
                onPress={() => setShowQualityModal(true)}
              >
                <Text style={styles.qualityText}>{selectedQuality}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
    </View>
  );

  const renderBottomActions = () => (
    <View style={styles.bottomSection}>
      {/* Action Buttons */}
      <View style={styles.bottomActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => setShowNotesModal(true)}
        >
          <Ionicons name="document-text" size={20} color={COLORS.primary} />
          <Text style={styles.actionButtonText}>Ghi chú ({notes.length})</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => setShowChaptersModal(true)}
        >
          <Ionicons name="list" size={20} color={COLORS.primary} />
          <Text style={styles.actionButtonText}>Chương</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, !mockVideoData.quizUnlocked && styles.actionButtonDisabled]}
          onPress={startQuiz}
        >
          <Ionicons 
            name="help-circle" 
            size={20} 
            color={mockVideoData.quizUnlocked ? COLORS.accent : COLORS.gray400} 
          />
          <Text style={[
            styles.actionButtonText, 
            { color: mockVideoData.quizUnlocked ? COLORS.accent : COLORS.gray400 }
          ]}>
            Quiz {!mockVideoData.quizUnlocked && '🔒'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="download" size={20} color={COLORS.primary} />
          <Text style={styles.actionButtonText}>Tải xuống</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share" size={20} color={COLORS.primary} />
          <Text style={styles.actionButtonText}>Chia sẻ</Text>
        </TouchableOpacity>
      </View>

      {/* Learning Progress Section */}
      <View style={styles.progressSection}>
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryLight]}
          style={styles.progressGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Tiến độ học tập</Text>
            <View style={styles.streakBadge}>
              <Ionicons name="flame" size={16} color={COLORS.warning} />
              <Text style={styles.streakText}>{mockLearningProgress.currentStreak} ngày</Text>
            </View>
          </View>

          <View style={styles.progressStats}>
            <View style={styles.progressStat}>
              <Text style={styles.progressStatNumber}>
                {mockLearningProgress.completedLessons}/{mockLearningProgress.totalLessons}
              </Text>
              <Text style={styles.progressStatLabel}>Bài học</Text>
            </View>

            <View style={styles.progressStat}>
              <Text style={styles.progressStatNumber}>
                {mockLearningProgress.totalStudyTime}
              </Text>
              <Text style={styles.progressStatLabel}>Phút học</Text>
            </View>

            <View style={styles.progressStat}>
              <Text style={styles.progressStatNumber}>
                {Math.round((mockLearningProgress.totalStudyTime / mockLearningProgress.weeklyGoal) * 100)}%
              </Text>
              <Text style={styles.progressStatLabel}>Mục tiêu tuần</Text>
            </View>
          </View>

          <View style={styles.weeklyGoalProgress}>
            <Text style={styles.weeklyGoalText}>Mục tiêu tuần này</Text>
            <View style={styles.weeklyGoalBar}>
              <View 
                style={[
                  styles.weeklyGoalFill, 
                  { width: `${Math.min((mockLearningProgress.totalStudyTime / mockLearningProgress.weeklyGoal) * 100, 100)}%` }
                ]} 
              />
            </View>
            <Text style={styles.weeklyGoalLabel}>
              {mockLearningProgress.totalStudyTime}/{mockLearningProgress.weeklyGoal} phút
            </Text>
          </View>
        </LinearGradient>
      </View>

      {/* Achievements Section */}
      <View style={styles.achievementsSection}>
        <Text style={styles.achievementsTitle}>Thành tích</Text>
        <View style={styles.achievementsList}>
          {mockLearningProgress.achievements.map((achievement) => (
            <View 
              key={achievement.id} 
              style={[
                styles.achievementItem,
                achievement.unlocked && styles.achievementUnlocked
              ]}
            >
              <LinearGradient
                colors={achievement.unlocked ? [COLORS.warning, '#D97706'] : [COLORS.gray300, COLORS.gray400]}
                style={styles.achievementIcon}
              >
                <Ionicons 
                  name={achievement.icon as any} 
                  size={20} 
                  color={COLORS.white} 
                />
              </LinearGradient>
              <Text style={[
                styles.achievementTitle,
                !achievement.unlocked && styles.achievementTitleLocked
              ]}>
                {achievement.title}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  // Quiz Modal with enhanced design
  const renderQuizModal = () => {
    if (!showQuizModal) return null;

    const currentQuestion = mockQuizData.questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === mockQuizData.questions.length - 1;
    const hasSelectedAnswer = selectedAnswers[currentQuestion.id] !== undefined;

    // Quiz Results Screen
    if (showQuizResults) {
      const score = calculateQuizScore();
      return (
        <Modal
          visible={showQuizModal}
          animationType="slide"
          presentationStyle="fullScreen"
          onRequestClose={() => setShowQuizModal(false)}
        >
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryDark, COLORS.accent]}
            style={styles.quizResultsContainer}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <SafeAreaView style={styles.quizResultsContent}>
              {/* Header with close button */}
              <View style={styles.quizResultsHeader}>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setShowQuizModal(false)}
                >
                  <Ionicons name="close" size={24} color={COLORS.white} />
                </TouchableOpacity>
              </View>

              {/* Results Body */}
              <View style={styles.quizResultsBody}>
                {/* Animated Score Circle */}
                <View style={styles.scoreCircleContainer}>
                  <View style={styles.scoreCircle}>
                    <LinearGradient
                      colors={[getScoreColor(score.percentage), getScoreColor(score.percentage) + 'DD']}
                      style={styles.scoreGradient}
                    >
                      <Text style={styles.scorePercentage}>{score.percentage}%</Text>
                      <Text style={styles.scoreLabel}>Điểm số</Text>
                    </LinearGradient>
                  </View>
                  
                  {/* Achievement badges */}
                  {score.percentage >= 80 && (
                    <View style={styles.achievementBadge}>
                      <Ionicons name="trophy" size={20} color={COLORS.warning} />
                    </View>
                  )}
                </View>

                <Text style={styles.scoreTitle}>
                  {score.percentage >= 80 ? 'Xuất sắc! 🎉' : 
                   score.percentage >= 60 ? 'Tốt lắm! 👍' : 'Cần cải thiện 📚'}
                </Text>

                <Text style={styles.scoreDescription}>
                  Bạn đã trả lời đúng {score.correct}/{score.total} câu hỏi
                </Text>

                {/* Score breakdown */}
                <View style={styles.scoreBreakdown}>
                  <View style={styles.scoreItem}>
                    <Ionicons name="checkmark-circle" size={24} color={COLORS.success} />
                    <Text style={styles.scoreItemLabel}>Đúng</Text>
                    <Text style={styles.scoreItemValue}>{score.correct}</Text>
                  </View>
                  <View style={styles.scoreItem}>
                    <Ionicons name="close-circle" size={24} color={COLORS.danger} />
                    <Text style={styles.scoreItemLabel}>Sai</Text>
                    <Text style={styles.scoreItemValue}>{score.total - score.correct}</Text>
                  </View>
                  <View style={styles.scoreItem}>
                    <Ionicons name="time" size={24} color={COLORS.info} />
                    <Text style={styles.scoreItemLabel}>Thời gian</Text>
                    <Text style={styles.scoreItemValue}>5:30</Text>
                  </View>
                </View>

                {/* Action buttons */}
                <View style={styles.quizActions}>
                  <TouchableOpacity 
                    style={styles.reviewButton}
                    onPress={() => {
                      setShowQuizResults(false);
                      setCurrentQuestionIndex(0);
                    }}
                  >
                    <Ionicons name="eye" size={20} color={COLORS.primary} />
                    <Text style={styles.reviewButtonText}>Xem lại đáp án</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.retakeButton}
                    onPress={() => {
                      setSelectedAnswers({});
                      setShowQuizResults(false);
                      setCurrentQuestionIndex(0);
                    }}
                  >
                    <Ionicons name="refresh" size={20} color={COLORS.white} />
                    <Text style={styles.retakeButtonText}>Làm lại</Text>
                  </TouchableOpacity>
                </View>

                {/* Motivational message */}
                <View style={styles.motivationContainer}>
                  <Text style={styles.motivationText}>
                    {score.percentage >= 80 
                      ? "Bạn đã nắm vững kiến thức! Hãy tiếp tục với bài học tiếp theo."
                      : score.percentage >= 60
                      ? "Kết quả tốt! Hãy xem lại một số câu để hiểu rõ hơn."
                      : "Đừng nản lòng! Hãy xem lại video và thử lại nhé."}
                  </Text>
                </View>
              </View>
            </SafeAreaView>
          </LinearGradient>
        </Modal>
      );
    }

    // Quiz Question Screen
    return (
      <Modal
        visible={showQuizModal}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setShowQuizModal(false)}
      >
        <SafeAreaView style={styles.quizContainer}>
          {/* Enhanced Header */}
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryLight]}
            style={styles.quizHeader}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <TouchableOpacity 
              style={styles.quizCloseButton}
              onPress={() => setShowQuizModal(false)}
            >
              <Ionicons name="close" size={24} color={COLORS.white} />
            </TouchableOpacity>
            
            <View style={styles.quizHeaderCenter}>
              <Text style={styles.quizTitle}>{mockQuizData.title}</Text>
              <View style={styles.quizProgress}>
                <Text style={styles.quizProgressText}>
                  Câu {currentQuestionIndex + 1} / {mockQuizData.questions.length}
                </Text>
                <View style={styles.quizProgressBar}>
                  <View 
                    style={[
                      styles.quizProgressFill, 
                      { width: `${((currentQuestionIndex + 1) / mockQuizData.questions.length) * 100}%` }
                    ]} 
                  />
                </View>
              </View>
            </View>

            <View style={styles.quizHeaderPlaceholder} />
          </LinearGradient>

          <ScrollView style={styles.quizContent} showsVerticalScrollIndicator={false}>
            {/* Question Card */}
            <View style={styles.questionCard}>
              <View style={styles.questionHeader}>
                <View style={styles.questionBadge}>
                  <Text style={styles.questionBadgeText}>Câu {currentQuestionIndex + 1}</Text>
                </View>
                <View style={styles.difficultyBadge}>
                  <Ionicons name="star" size={12} color={COLORS.warning} />
                  <Text style={styles.difficultyText}>Cơ bản</Text>
                </View>
              </View>
              
              <Text style={styles.questionText}>{currentQuestion.question}</Text>
            </View>

            {/* Options Container */}
            <View style={styles.optionsContainer}>
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswers[currentQuestion.id] === index;
                const isCorrect = index === currentQuestion.correctAnswer;
                const showResults = quizCompleted || showQuizResults;
                
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.optionButton,
                      isSelected && !showResults && styles.optionSelected,
                      showResults && isCorrect && styles.optionCorrect,
                      showResults && isSelected && !isCorrect && styles.optionIncorrect
                    ]}
                    onPress={() => !showResults && selectAnswer(currentQuestion.id, index)}
                    disabled={showResults}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={
                        showResults && isCorrect 
                          ? [COLORS.success + '20', COLORS.success + '10']
                          : showResults && isSelected && !isCorrect
                          ? [COLORS.danger + '20', COLORS.danger + '10']
                          : isSelected
                          ? [COLORS.primary + '20', COLORS.primary + '10']
                          : ['transparent', 'transparent']
                      }
                      style={styles.optionGradient}
                    >
                      <View style={styles.optionContent}>
                        <View style={[
                          styles.optionIndicator,
                          isSelected && !showResults && styles.optionIndicatorSelected,
                          showResults && isCorrect && styles.optionIndicatorCorrect,
                          showResults && isSelected && !isCorrect && styles.optionIndicatorIncorrect
                        ]}>
                          {showResults ? (
                            isCorrect ? (
                              <Ionicons name="checkmark" size={16} color={COLORS.white} />
                            ) : isSelected ? (
                              <Ionicons name="close" size={16} color={COLORS.white} />
                            ) : (
                              <Text style={styles.optionLetter}>{String.fromCharCode(65 + index)}</Text>
                            )
                          ) : (
                            <Text style={[
                              styles.optionLetter,
                              isSelected && styles.optionLetterSelected
                            ]}>
                              {String.fromCharCode(65 + index)}
                            </Text>
                          )}
                        </View>
                        <Text style={[
                          styles.optionText,
                          isSelected && !showResults && styles.optionTextSelected,
                          showResults && isCorrect && styles.optionTextCorrect,
                          showResults && isSelected && !isCorrect && styles.optionTextIncorrect
                        ]}>
                          {option}
                        </Text>
                        
                        {/* Checkmark animation for selected */}
                        {isSelected && !showResults && (
                          <View style={styles.selectedIndicator}>
                            <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
                          </View>
                        )}
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Explanation for review mode */}
            {(quizCompleted || showQuizResults) && (
              <View style={styles.explanationContainer}>
                <LinearGradient
                  colors={[COLORS.warning + '15', COLORS.warning + '05']}
                  style={styles.explanationGradient}
                >
                  <View style={styles.explanationHeader}>
                    <View style={styles.explanationIcon}>
                      <Ionicons name="bulb" size={20} color={COLORS.warning} />
                    </View>
                    <Text style={styles.explanationTitle}>Giải thích</Text>
                  </View>
                  <Text style={styles.explanationText}>{currentQuestion.explanation}</Text>
                </LinearGradient>
              </View>
            )}

            {/* Help hint when no answer selected */}
            {!hasSelectedAnswer && !(quizCompleted || showQuizResults) && (
              <View style={styles.hintContainer}>
                <Ionicons name="information-circle" size={16} color={COLORS.info} />
                <Text style={styles.hintText}>Chọn một đáp án để tiếp tục</Text>
              </View>
            )}
          </ScrollView>

          {/* Enhanced Footer */}
          <LinearGradient
            colors={[COLORS.white, COLORS.gray50]}
            style={styles.quizFooter}
          >
            <TouchableOpacity 
              style={[
                styles.quizNavButton, 
                (currentQuestionIndex === 0 || quizCompleted || showQuizResults) && styles.quizNavButtonDisabled
              ]}
              onPress={previousQuestion}
              disabled={currentQuestionIndex === 0 || quizCompleted || showQuizResults}
            >
              <Ionicons 
                name="chevron-back" 
                size={20} 
                color={currentQuestionIndex === 0 || quizCompleted || showQuizResults ? COLORS.gray400 : COLORS.primary} 
              />
              <Text style={[
                styles.quizNavButtonText,
                (currentQuestionIndex === 0 || quizCompleted || showQuizResults) && styles.quizNavButtonTextDisabled
              ]}>
                Trước
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.quizSubmitButton,
                (!hasSelectedAnswer && !(quizCompleted || showQuizResults)) && styles.quizSubmitButtonDisabled
              ]}
              onPress={nextQuestion}
              disabled={!hasSelectedAnswer && !(quizCompleted || showQuizResults)}
            >
              <LinearGradient
                colors={
                  hasSelectedAnswer || (quizCompleted || showQuizResults)
                    ? [COLORS.primary, COLORS.primaryDark] 
                    : [COLORS.gray300, COLORS.gray400]
                }
                style={styles.submitButtonGradient}
              >
                <Text style={[
                  styles.quizSubmitButtonText,
                  (!hasSelectedAnswer && !(quizCompleted || showQuizResults)) && styles.quizSubmitButtonTextDisabled
                ]}>
                  {isLastQuestion ? 'Hoàn thành' : 'Tiếp theo'}
                </Text>
                <Ionicons 
                  name={isLastQuestion ? "checkmark" : "chevron-forward"} 
                  size={20} 
                  color={(hasSelectedAnswer || (quizCompleted || showQuizResults)) ? COLORS.white : COLORS.gray500} 
                />
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </SafeAreaView>
      </Modal>
    );
  };

  // Speed Modal
  const renderSpeedModal = () => (
    <Modal
      visible={showSpeedModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowSpeedModal(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Tốc độ phát</Text>
          <TouchableOpacity onPress={() => setShowSpeedModal(false)}>
            <Ionicons name="close" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.modalContent}>
          {playbackSpeeds.map((speed) => (
            <TouchableOpacity
              key={speed}
              style={[
                styles.modalOption,
                playbackSpeed === speed && styles.modalOptionSelected
              ]}
              onPress={() => {
                setPlaybackSpeed(speed);
                setShowSpeedModal(false);
              }}
            >
              <Text style={[
                styles.modalOptionText,
                playbackSpeed === speed && styles.modalOptionTextSelected
              ]}>
                {speed}x {speed === 1 ? '(Bình thường)' : ''}
              </Text>
              {playbackSpeed === speed && (
                <Ionicons name="checkmark" size={20} color={COLORS.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>
    </Modal>
  );

  // Quality Modal
  const renderQualityModal = () => (
    <Modal
      visible={showQualityModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowQualityModal(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Chất lượng video</Text>
          <TouchableOpacity onPress={() => setShowQualityModal(false)}>
            <Ionicons name="close" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.modalContent}>
          {qualities.map((quality) => (
            <TouchableOpacity
              key={quality}
              style={[
                styles.modalOption,
                selectedQuality === quality && styles.modalOptionSelected
              ]}
              onPress={() => {
                setSelectedQuality(quality);
                setShowQualityModal(false);
              }}
            >
              <Text style={[
                styles.modalOptionText,
                selectedQuality === quality && styles.modalOptionTextSelected
              ]}>
                {quality}
              </Text>
              {selectedQuality === quality && (
                <Ionicons name="checkmark" size={20} color={COLORS.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>
    </Modal>
  );

  // Notes Modal
  const renderNotesModal = () => (
    <Modal
      visible={showNotesModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowNotesModal(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Ghi chú của tôi</Text>
          <TouchableOpacity onPress={() => setShowNotesModal(false)}>
            <Ionicons name="close" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.addNoteContainer}>
          <TextInput
            style={styles.noteInput}
            placeholder={`Thêm ghi chú tại ${formatTime(currentTime)}`}
            value={newNote}
            onChangeText={setNewNote}
            multiline
          />
          <TouchableOpacity 
            style={styles.addNoteButton}
            onPress={addNote}
          >
            <Ionicons name="add" size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          {notes.map((note) => (
            <View key={note.id} style={styles.noteItem}>
              <TouchableOpacity 
                style={styles.noteTimeButton}
                onPress={() => {
                  seekTo(note.time);
                  setShowNotesModal(false);
                }}
              >
                <Text style={styles.noteTime}>{note.timestamp}</Text>
              </TouchableOpacity>
              <View style={styles.noteContent}>
                <Text style={styles.noteText}>{note.content}</Text>
              </View>
              <TouchableOpacity 
                style={styles.deleteNoteButton}
                onPress={() => deleteNote(note.id)}
              >
                <Ionicons name="trash" size={16} color={COLORS.danger} />
              </TouchableOpacity>
            </View>
          ))}
          {notes.length === 0 && (
            <View style={styles.emptyNotes}>
              <Ionicons name="document-text-outline" size={48} color={COLORS.gray400} />
              <Text style={styles.emptyNotesText}>Chưa có ghi chú nào</Text>
              <Text style={styles.emptyNotesSubtext}>
                Thêm ghi chú để ghi nhớ những điểm quan trọng
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  // Chapters Modal
  const renderChaptersModal = () => (
    <Modal
      visible={showChaptersModal}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowChaptersModal(false)}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Chương</Text>
          <TouchableOpacity onPress={() => setShowChaptersModal(false)}>
            <Ionicons name="close" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.modalContent}>
          {mockVideoData.chapters.map((chapter) => (
            <TouchableOpacity
              key={chapter.id}
              style={[
                styles.chapterItem,
                currentTime >= chapter.startTime && styles.activeChapter
              ]}
              onPress={() => jumpToChapter(chapter.startTime)}
            >
              <View style={styles.chapterInfo}>
                <Text style={[
                  styles.chapterTitle,
                  currentTime >= chapter.startTime && styles.activeChapterTitle
                ]}>
                  {chapter.title}
                </Text>
                <Text style={styles.chapterTime}>
                  {formatTime(chapter.startTime)}
                </Text>
              </View>
              {currentTime >= chapter.startTime && (
                <Ionicons name="play" size={16} color={COLORS.primary} />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <StatusBar 
        barStyle={isFullscreen ? "light-content" : "dark-content"} 
        backgroundColor={isFullscreen ? "#000" : COLORS.background}
        hidden={isFullscreen}
      />
      
      {renderVideoPlayer()}
      
      {!isFullscreen && renderBottomActions()}
      
      {renderQuizModal()}
      {renderSpeedModal()}
      {renderQualityModal()}
      {renderNotesModal()}
      {renderChaptersModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  videoContainer: {
    width: width,
    height: width * (9/16), // 16:9 aspect ratio
    backgroundColor: COLORS.black,
    position: 'relative',
  },
  fullscreenVideo: {
    width: height,
    height: width,
    transform: [{ rotate: '90deg' }],
    position: 'absolute',
    top: (height - width) / 2,
    left: (width - height) / 2,
  },
  videoTouchArea: {
    flex: 1,
  },
  videoPlaceholder: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  videoGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
  },
  topControls: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    marginHorizontal: 16,
  },
  videoTitle: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  courseTitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  fullscreenButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerPlayButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomControls: {
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 16,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  controlButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  timeText: {
    color: COLORS.white,
    fontSize: 14,
    marginLeft: 8,
  },
  rightControls: {
    flexDirection: 'row',
    marginLeft: 'auto',
    gap: 12,
  },
  controlButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  speedText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  qualityText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },

  // Bottom Section
  bottomSection: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  bottomActions: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 16,
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  actionButton: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  actionButtonDisabled: {
    opacity: 0.5,
  },
  actionButtonText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '500',
    textAlign: 'center',
  },

  // Progress Section
  progressSection: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  progressGradient: {
    padding: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  streakText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  progressStat: {
    alignItems: 'center',
  },
  progressStatNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
  },
  progressStatLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  weeklyGoalProgress: {
    alignItems: 'center',
  },
  weeklyGoalText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 8,
  },
  weeklyGoalBar: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  weeklyGoalFill: {
    height: '100%',
    backgroundColor: COLORS.warning,
    borderRadius: 4,
  },
  weeklyGoalLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },

  // Achievements Section
  achievementsSection: {
    backgroundColor: COLORS.white,
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  achievementsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  achievementsList: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  achievementItem: {
    alignItems: 'center',
    gap: 8,
    opacity: 0.5,
  },
  achievementUnlocked: {
    opacity: 1,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementTitle: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: '500',
    textAlign: 'center',
  },
  achievementTitleLocked: {
    color: COLORS.gray400,
  },

  // Quiz Styles
  quizContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  quizHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  quizCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quizHeaderCenter: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  quizTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 8,
    textAlign: 'center',
  },
  quizProgress: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  quizProgressText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  quizProgressBar: {
    width: '100%',
    height: 4,
    backgroundColor: COLORS.gray200,
    borderRadius: 2,
    overflow: 'hidden',
  },
  quizProgressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  quizHeaderPlaceholder: {
    width: 24,
  },
  quizContent: {
    flex: 1,
    padding: 20,
  },
  questionContainer: {
    marginBottom: 24,
  },
  questionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  questionBadge: {
    backgroundColor: COLORS.primary + '15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  questionBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  difficultyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.warning + '15',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  difficultyText: {
    fontSize: 10,
    color: COLORS.warning,
    fontWeight: '600',
  },
  questionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 12,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    lineHeight: 26,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    overflow: 'hidden',
  },
  optionGradient: {
    flex: 1,
    padding: 16,
  },
  optionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '05',
  },
  optionCorrect: {
    borderColor: COLORS.success,
    backgroundColor: COLORS.success + '05',
  },
  optionIncorrect: {
    borderColor: COLORS.danger,
    backgroundColor: COLORS.danger + '05',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  optionIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.gray200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionIndicatorSelected: {
    backgroundColor: COLORS.primary,
  },
  optionIndicatorCorrect: {
    backgroundColor: COLORS.success,
  },
  optionIndicatorIncorrect: {
    backgroundColor: COLORS.danger,
  },
  optionLetter: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.gray600,
  },
  optionLetterSelected: {
    color: COLORS.white,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
  optionTextSelected: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  optionTextCorrect: {
    color: COLORS.success,
    fontWeight: '600',
  },
  optionTextIncorrect: {
    color: COLORS.danger,
    fontWeight: '600',
  },
  selectedIndicator: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  explanationContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: COLORS.warning + '10',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.warning,
  },
  explanationGradient: {
    padding: 16,
    borderRadius: 12,
  },
  explanationIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.warning + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.info + '10',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    gap: 8,
  },
  hintText: {
    fontSize: 14,
    color: COLORS.info,
    fontWeight: '500',
  },
  explanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.warning,
  },
  explanationText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  quizFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  quizNavButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  quizNavButtonDisabled: {
    opacity: 0.5,
  },
  quizNavButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  quizNavButtonTextDisabled: {
    color: COLORS.gray400,
  },
  quizSubmitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  quizSubmitButtonDisabled: {
    backgroundColor: COLORS.gray300,
  },
  quizSubmitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
  quizSubmitButtonTextDisabled: {
    color: COLORS.gray400,
  },
  submitButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },

  // Quiz Results
  quizResultsContainer: {
    flex: 1,
  },
  quizResultsContent: {
    flex: 1,
  },
  quizResultsHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quizResultsBody: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  scoreCircleContainer: {
    position: 'relative',
    marginBottom: 32,
  },
  scoreCircle: {
    marginBottom: 32,
  },
  scoreGradient: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scorePercentage: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  scoreLabel: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 4,
  },
  achievementBadge: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  scoreTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 12,
  },
  scoreDescription: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: 32,
  },
  scoreBreakdown: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 32,
  },
  scoreItem: {
    alignItems: 'center',
    gap: 8,
  },
  scoreItemLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  scoreItemValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  motivationContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  motivationText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 20,
  },
  quizActions: {
    flexDirection: 'row',
    gap: 16,
  },
  reviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  reviewButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    gap: 8,
  },
  retakeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 8,
  },
  modalOptionSelected: {
    backgroundColor: COLORS.primary + '15',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  modalOptionText: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
  modalOptionTextSelected: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  addNoteContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 12,
  },
  noteInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    maxHeight: 80,
  },
  addNoteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noteItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'flex-start',
    gap: 12,
  },
  noteTimeButton: {
    backgroundColor: COLORS.primary + '15',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  noteTime: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  noteContent: {
    flex: 1,
  },
  noteText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  deleteNoteButton: {
    padding: 4,
  },
  emptyNotes: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyNotesText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray600,
    marginTop: 12,
    marginBottom: 8,
  },
  emptyNotesSubtext: {
    fontSize: 14,
    color: COLORS.gray400,
    textAlign: 'center',
    lineHeight: 20,
  },

  // Chapter Modal Styles
  chapterItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  activeChapter: {
    backgroundColor: COLORS.primary + '15',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  chapterInfo: {
    flex: 1,
  },
  chapterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  activeChapterTitle: {
    color: COLORS.primary,
  },
  chapterTime: {
    fontSize: 14,
    color: COLORS.gray600,
  },
});

export default VideoPlayerScreen;