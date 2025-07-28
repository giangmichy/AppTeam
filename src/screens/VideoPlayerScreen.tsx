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
  ]
};

const VideoPlayerScreen = () => {
  const navigation = useNavigation<VideoPlayerScreenNavigationProp>();
  const route = useRoute();
  const { t } = useTranslation();
  const { videoUrl, title, courseId, lessonId } = route.params;

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
  const [newNote, setNewNote] = useState('');
  const [notes, setNotes] = useState(mockVideoData.notes);

  const controlsOpacity = useRef(new Animated.Value(1)).current;
  const progressRef = useRef<View>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      if (isPlaying) {
        setCurrentTime(prev => Math.min(prev + 1, duration));
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

      <TouchableOpacity style={styles.actionButton}>
        <Ionicons name="download" size={20} color={COLORS.primary} />
        <Text style={styles.actionButtonText}>Tải xuống</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionButton}>
        <Ionicons name="share" size={20} color={COLORS.primary} />
        <Text style={styles.actionButtonText}>Chia sẻ</Text>
      </TouchableOpacity>
    </View>
  );

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
    backgroundColor: COLORS.black,
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
  bottomActions: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 16,
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  actionButton: {
    alignItems: 'center',
    gap: 8,
  },
  actionButtonText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '500',
  },
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
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyNotesSubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  chapterItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: COLORS.white,
    borderRadius: 12,
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
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 4,
  },
  activeChapterTitle: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  chapterTime: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});

export default VideoPlayerScreen;