// src/tests/StudentRegistration.test.jsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import StudentRegistration from '../pages/StudentRegistration';
import * as studentService from '../services/studentService';
import { applicationService } from '../services/applicationService';

// Mock'ları hazırla
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  },
  ToastContainer: () => null,
}));

vi.mock('../services/studentService');
vi.mock('../services/applicationService');

// Mock veri
const mockConfigurations = {
  'Futbol': {
    categories: {
      'U12': { weights: [] },
      'U14': { weights: [] }
    }
  },
  'Basketbol': {
    categories: {
      'U12': { weights: [] },
      'U14': { weights: [] }
    }
  },
  'Taekwondo': {
    categories: {
      'Minikler': { weights: ['30', '35', '40', '45'] },
      'Yıldızlar': { weights: ['40', '45', '50', '55'] }
    }
  }
};

const mockDistricts = ['Kadıköy', 'Üsküdar', 'Ataşehir'];
const mockSchools = ['Atatürk İlkokulu', 'Cumhuriyet Ortaokulu', 'Gazi Lisesi'];

// Test wrapper component (Router için)
const TestWrapper = ({ children }) => {
  return <BrowserRouter>{children}</BrowserRouter>;
};

describe('StudentRegistration Component', () => {
  
  beforeEach(() => {
    // Her testten önce mock'ları sıfırla
    vi.clearAllMocks();
    
    // API mock'larını ayarla
    studentService.getSportConfigurations.mockResolvedValue(mockConfigurations);
    applicationService.getDistrictsBySide.mockResolvedValue(mockDistricts);
    applicationService.getSchoolsByDistrict.mockResolvedValue(mockSchools);
    studentService.createStudentRegistration.mockResolvedValue({ success: true });
  });

  describe('İlk Yükleme ve Başlangıç Durumu', () => {
    
    it('component başarıyla render edilmeli', async () => {
      render(
        <TestWrapper>
          <StudentRegistration />
        </TestWrapper>
      );
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /Öğrenci.*Kayıt Formu/i })).toBeInTheDocument();
      });
    });

    it('başlangıçta Adım 1 görünmeli', async () => {
      render(
        <TestWrapper>
          <StudentRegistration />
        </TestWrapper>
      );
      
      await waitFor(() => {
        expect(screen.getByText(/Okul Bilgileri/i)).toBeInTheDocument();
      });
    });

    it('konfigürasyonlar yüklenmeli', async () => {
      render(
        <TestWrapper>
          <StudentRegistration />
        </TestWrapper>
      );
      
      await waitFor(() => {
        expect(studentService.getSportConfigurations).toHaveBeenCalled();
      });
    });

    it('bilgilendirme kutusu görünmeli', async () => {
      render(
        <TestWrapper>
          <StudentRegistration />
        </TestWrapper>
      );
      
      await waitFor(() => {
        expect(screen.getByText(/Önemli Bilgilendirme/i)).toBeInTheDocument();
      });
    });
  });

  describe('Adım 1: Okul Bilgileri', () => {
    
    it('yaka seçilmeden ilçe dropdown disabled olmalı', async () => {
      render(
        <TestWrapper>
          <StudentRegistration />
        </TestWrapper>
      );
      
      await waitFor(() => {
        const ilceSelect = screen.getAllByRole('combobox').find(
          select => select.closest('div')?.querySelector('label')?.textContent.includes('İlçe')
        );
        expect(ilceSelect).toBeDisabled();
      });
    });

    it('yaka seçildiğinde ilçeler yüklenmeli', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <StudentRegistration />
        </TestWrapper>
      );
      
      await waitFor(async () => {
        const selects = screen.getAllByRole('combobox');
        const yakaSelect = selects[0]; // İlk select yaka
        await user.selectOptions(yakaSelect, 'Anadolu');
      });

      await waitFor(() => {
        expect(applicationService.getDistrictsBySide).toHaveBeenCalledWith('Anadolu');
      });
    });

    it('ilçe seçildiğinde okullar yüklenmeli', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <StudentRegistration />
        </TestWrapper>
      );
      
      // Önce yaka seç
      await waitFor(async () => {
        const selects = screen.getAllByRole('combobox');
        await user.selectOptions(selects[0], 'Anadolu');
      });
      
      // Sonra ilçe seç
      await waitFor(async () => {
        const selects = screen.getAllByRole('combobox');
        const ilceSelect = selects[1];
        await user.selectOptions(ilceSelect, mockDistricts[0]);
      });

      await waitFor(() => {
        expect(applicationService.getSchoolsByDistrict).toHaveBeenCalledWith(mockDistricts[0]);
      });
    });
  });

  describe('Adım Navigasyonu', () => {
    
    it('İleri butonu çalışmalı', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <StudentRegistration />
        </TestWrapper>
      );
      
      // Okul bilgilerini doldur
      await completeStep1(user);
      
      await waitFor(() => {
        expect(screen.getByText(/Öğretmen Bilgileri/i)).toBeInTheDocument();
      });
    });

    it('Geri butonu çalışmalı ve verileri korumalı', async () => {
      const user = userEvent.setup();
      render(
        <TestWrapper>
          <StudentRegistration />
        </TestWrapper>
      );
      
      // Adım 2'ye geç
      await completeStep1(user);
      
      // Geri dön
      const geriButton = screen.getByRole('button', { name: /geri/i });
      await user.click(geriButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Okul Bilgileri/i)).toBeInTheDocument();
      });
    });
  });

  describe('Öğrenci Ekleme', () => {
    
    it('öğrenci eklenebilmeli', async () => {
      const user = userEvent.setup();
      const { toast } = await import('react-toastify');
      
      render(
        <TestWrapper>
          <StudentRegistration />
        </TestWrapper>
      );
      
      // Son adıma git
      await navigateToStudentStep(user);
      
      // Öğrenci bilgilerini doldur
      await waitFor(async () => {
        const inputs = screen.getAllByRole('textbox');
        const firstNameInput = inputs.find(input => 
          input.placeholder?.includes('Öğrenci Adı')
        );
        const lastNameInput = inputs.find(input => 
          input.placeholder?.includes('Öğrenci Soyadı')
        );
        
        await user.type(firstNameInput, 'Ali');
        await user.type(lastNameInput, 'Veli');
        
        // Doğum tarihi
        const dateInputs = screen.getAllByDisplayValue('');
        const birthDateInput = dateInputs.find(input => 
          input.type === 'date'
        );
        await user.type(birthDateInput, '2010-05-15');
        
        const addButton = screen.getByRole('button', { name: /Listeye Ekle/i });
        await user.click(addButton);
      });

      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('Öğrenci eklendi');
      });
    });

    it('Taekwondo için sicil numarası zorunlu olmalı', async () => {
      const user = userEvent.setup();
      const { toast } = await import('react-toastify');
      
      render(
        <TestWrapper>
          <StudentRegistration />
        </TestWrapper>
      );
      
      // Taekwondo ile son adıma git
      await navigateToStudentStep(user, 'Taekwondo');
      
      // Sicil numarası olmadan ekle
      await waitFor(async () => {
        const inputs = screen.getAllByRole('textbox');
        const firstNameInput = inputs.find(input => 
          input.placeholder?.includes('Öğrenci Adı')
        );
        const lastNameInput = inputs.find(input => 
          input.placeholder?.includes('Öğrenci Soyadı')
        );
        
        await user.type(firstNameInput, 'Ali');
        await user.type(lastNameInput, 'Veli');
        
        const dateInputs = screen.getAllByDisplayValue('');
        const birthDateInput = dateInputs.find(input => input.type === 'date');
        await user.type(birthDateInput, '2010-05-15');
        
        const addButton = screen.getByRole('button', { name: /Listeye Ekle/i });
        await user.click(addButton);
      });

      expect(toast.warning).toHaveBeenCalledWith('Taekwondo için sicil numarası zorunludur');
    });

    it('öğrenci silinebilmeli', async () => {
      const user = userEvent.setup();
      const { toast } = await import('react-toastify');
      
      render(
        <TestWrapper>
          <StudentRegistration />
        </TestWrapper>
      );
      
      await navigateToStudentStep(user);
      
      // Önce bir öğrenci ekle
      await addStudent(user, 'Ali', 'Veli', '2010-05-15');
      
      // Öğrencinin listeye eklendiğini kontrol et
      await waitFor(() => {
        expect(screen.getByText(/Ali Veli/i)).toBeInTheDocument();
      });
      
      // Şimdi sil
      const deleteButtons = screen.getAllByRole('button');
      const trashButton = deleteButtons.find(btn => 
        btn.querySelector('svg')?.getAttribute('class')?.includes('lucide')
      );
      
      if (trashButton) {
        await user.click(trashButton);
      }
      
      await waitFor(() => {
        expect(toast.info).toHaveBeenCalledWith('Öğrenci silindi');
      });
    });
  });

  describe('Form Gönderimi', () => {
    
    it('başarılı form gönderimi', async () => {
      const user = userEvent.setup();
      
      render(
        <TestWrapper>
          <StudentRegistration />
        </TestWrapper>
      );
      
      await navigateToStudentStep(user);
      await addStudent(user, 'Ali', 'Veli', '2010-05-15');
      
      const submitButton = screen.getByRole('button', { name: /Kaydı Tamamla/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(studentService.createStudentRegistration).toHaveBeenCalled();
      }, { timeout: 3000 });
    });

    it('hatalı form gönderimi durumunda hata mesajı gösterilmeli', async () => {
      const user = userEvent.setup();
      
      studentService.createStudentRegistration.mockRejectedValue({
        error: 'Sunucu hatası oluştu'
      });
      
      render(
        <TestWrapper>
          <StudentRegistration />
        </TestWrapper>
      );
      
      await navigateToStudentStep(user);
      await addStudent(user, 'Ali', 'Veli', '2010-05-15');
      
      const submitButton = screen.getByRole('button', { name: /Kaydı Tamamla/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Sunucu hatası/i)).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });
});

// ==================== YARDIMCI FONKSİYONLAR ====================

async function completeStep1(user) {
    await waitFor(async () => {
      const selects = screen.getAllByRole('combobox');
      await user.selectOptions(selects[0], 'Anadolu');
    });
  
    await waitFor(async () => {
      const selects = screen.getAllByRole('combobox');
      await user.selectOptions(selects[1], mockDistricts[0]);
    });
  
    await waitFor(async () => {
      const selects = screen.getAllByRole('combobox');
      await user.selectOptions(selects[2], mockSchools[0]);
    });
  
    await waitFor(async () => {
      const selects = screen.getAllByRole('combobox');
      await user.selectOptions(selects[3], 'Lise');
    });
  
    const nextButton = screen.getByText('İleri').closest('button');
    await user.click(nextButton);
  }
  
  async function navigateToStudentStep(user, sportBranch = 'Futbol') {
    await completeStep1(user);
    
    await waitFor(async () => {
      const inputs = screen.getAllByRole('textbox');
      const nameInput = inputs.find(input => input.placeholder?.includes('Ahmet Yılmaz'));
      const phoneInput = inputs.find(input => input.placeholder?.includes('05X'));
      
      await user.clear(nameInput);
      await user.type(nameInput, 'Mehmet Yılmaz');
      await user.clear(phoneInput);
      await user.type(phoneInput, '05551234567');
      
      const nextButton = screen.getByText('İleri').closest('button');
      await user.click(nextButton);
    });
    
    await waitFor(async () => {
      const selects = screen.getAllByRole('combobox');
      await user.selectOptions(selects[0], sportBranch);
      
      const nextButton = screen.getByText('İleri').closest('button');
      await user.click(nextButton);
    });
    
    await waitFor(async () => {
      const selects = screen.getAllByRole('combobox');
      const firstOption = selects[0].options[1]?.value;
      if (firstOption) {
        await user.selectOptions(selects[0], firstOption);
      }
      
      const nextButton = screen.getByText('İleri').closest('button');
      await user.click(nextButton);
    });
    
    if (sportBranch === 'Taekwondo') {
      await waitFor(async () => {
        const selects = screen.getAllByRole('combobox');
        const firstWeight = selects[0].options[1]?.value;
        if (firstWeight) {
          await user.selectOptions(selects[0], firstWeight);
        }
        
        const nextButton = screen.getByText('İleri').closest('button');
        await user.click(nextButton);
      });
    }
  }
  
  async function addStudent(user, firstName, lastName, birthDate, registrationNumber = null) {
    await waitFor(async () => {
      const inputs = screen.getAllByRole('textbox');
      const firstNameInput = inputs.find(input => input.placeholder?.includes('Öğrenci Adı'));
      const lastNameInput = inputs.find(input => input.placeholder?.includes('Öğrenci Soyadı'));
      
      await user.clear(firstNameInput);
      await user.type(firstNameInput, firstName);
      await user.clear(lastNameInput);
      await user.type(lastNameInput, lastName);
      
      const dateInputs = screen.getAllByDisplayValue('');
      const birthDateInput = dateInputs.find(input => input.type === 'date');
      await user.type(birthDateInput, birthDate);
      
      if (registrationNumber) {
        const regNumInput = inputs.find(input => input.placeholder?.includes('34-TKD'));
        if (regNumInput) {
          await user.clear(regNumInput);
          await user.type(regNumInput, registrationNumber);
        }
      }
      
      const addButton = screen.getByText('Listeye Ekle').closest('button');
      await user.click(addButton);
    });
  }
  