-- =============================================
-- SEED DATA FOR DEVELOPMENT
-- =============================================
-- This file contains realistic Turkish test data for development.
-- DO NOT run this in production!
-- 
-- Usage: Run this in Supabase SQL Editor or via CLI
-- supabase db reset (will run seed.sql automatically if configured)

-- =============================================
-- CLEAR EXISTING DATA (Optional - uncomment if needed)
-- =============================================
-- TRUNCATE TABLE public.payments CASCADE;
-- TRUNCATE TABLE public.social_aid_applications CASCADE;
-- TRUNCATE TABLE public.documents CASCADE;
-- TRUNCATE TABLE public.kumbaras CASCADE;
-- TRUNCATE TABLE public.donations CASCADE;
-- TRUNCATE TABLE public.beneficiaries CASCADE;
-- TRUNCATE TABLE public.members CASCADE;

-- =============================================
-- MEMBERS (Üyeler) - 15 records
-- =============================================
INSERT INTO public.members (tc_kimlik_no, ad, soyad, email, telefon, cinsiyet, dogum_tarihi, adres, uye_turu, kayit_tarihi, aidat_durumu, kan_grubu, meslegi, notlar) VALUES
('12345678901', 'Ahmet', 'Yılmaz', 'ahmet.yilmaz@example.com', '05321234567', 'erkek', '1985-03-15', 'İstanbul, Kadıköy, Moda Mahallesi, Atatürk Caddesi No:45', 'standart', '2024-01-15', 'odendi', 'A+', 'Mühendis', 'Aktif üye'),
('23456789012', 'Ayşe', 'Demir', 'ayse.demir@example.com', '05322345678', 'kadin', '1990-07-22', 'Ankara, Çankaya, Kızılay Mahallesi, İnönü Bulvarı No:12', 'standart', '2024-02-10', 'odendi', 'B+', 'Öğretmen', NULL),
('34567890123', 'Mehmet', 'Kaya', 'mehmet.kaya@example.com', '05323456789', 'erkek', '1978-11-08', 'İzmir, Konak, Alsancak Mahallesi, Kordon Boyu No:78', 'onursal', '2023-12-01', 'odendi', '0+', 'Doktor', 'Onursal üye - 10 yıllık üyelik'),
('45678901234', 'Fatma', 'Şahin', 'fatma.sahin@example.com', '05324567890', 'kadin', '1992-05-30', 'Bursa, Nilüfer, Özlüce Mahallesi, Fomara Caddesi No:23', 'standart', '2024-03-05', 'beklemede', 'AB+', 'Hemşire', NULL),
('56789012345', 'Ali', 'Çelik', 'ali.celik@example.com', '05325678901', 'erkek', '1988-09-14', 'Antalya, Muratpaşa, Lara Mahallesi, Atatürk Bulvarı No:56', 'standart', '2024-01-20', 'odendi', 'A-', 'Avukat', NULL),
('67890123456', 'Zeynep', 'Arslan', 'zeynep.arslan@example.com', '05326789012', 'kadin', '1995-12-03', 'Adana, Seyhan, Kurtuluş Mahallesi, Ziyapaşa Bulvarı No:34', 'standart', '2024-02-28', 'gecikti', 'B-', 'Mimar', 'Aidat gecikmesi var'),
('78901234567', 'Mustafa', 'Özdemir', 'mustafa.ozdemir@example.com', '05327890123', 'erkek', '1982-04-18', 'Gaziantep, Şahinbey, Karataş Mahallesi, Atatürk Caddesi No:67', 'fahri', '2023-11-15', 'odendi', '0-', 'İş İnsanı', 'Fahri üye - bağışçı'),
('89012345678', 'Elif', 'Yıldız', 'elif.yildiz@example.com', '05328901234', 'kadin', '1993-08-25', 'Kocaeli, İzmit, Yenişehir Mahallesi, Cumhuriyet Caddesi No:89', 'standart', '2024-03-12', 'odendi', 'AB-', 'Eczacı', NULL),
('90123456789', 'Hasan', 'Koç', 'hasan.koc@example.com', '05329012345', 'erkek', '1987-01-10', 'Trabzon, Ortahisar, Meydan Mahallesi, Uzun Sokak No:12', 'standart', '2024-01-08', 'odendi', 'A+', 'Öğretmen', NULL),
('01234567890', 'Selin', 'Aydın', 'selin.aydin@example.com', '05320123456', 'kadin', '1991-06-20', 'Eskişehir, Tepebaşı, Arifiye Mahallesi, İnönü Caddesi No:45', 'standart', '2024-02-15', 'beklemede', 'B+', 'Psikolog', NULL),
('11223344556', 'Burak', 'Türk', 'burak.turk@example.com', '05321234567', 'erkek', '1989-10-05', 'Samsun, İlkadım, Fener Mahallesi, Atatürk Bulvarı No:78', 'standart', '2024-03-01', 'odendi', '0+', 'Mühendis', NULL),
('22334455667', 'Deniz', 'Kurt', 'deniz.kurt@example.com', '05322345678', 'kadin', '1994-02-28', 'Mersin, Yenişehir, Çiftçiler Mahallesi, Adnan Menderes Bulvarı No:23', 'standart', '2024-02-20', 'odendi', 'A-', 'Doktor', NULL),
('33445566778', 'Emre', 'Polat', 'emre.polat@example.com', '05323456789', 'erkek', '1986-07-12', 'Kayseri, Melikgazi, Hunat Mahallesi, Talas Caddesi No:56', 'standart', '2024-01-25', 'odendi', 'B-', 'Öğretmen', NULL),
('44556677889', 'Gizem', 'Erdoğan', 'gizem.erdogan@example.com', '05324567890', 'kadin', '1996-11-15', 'Malatya, Battalgazi, Fırat Mahallesi, İnönü Caddesi No:34', 'standart', '2024-03-08', 'beklemede', 'AB+', 'Hemşire', NULL),
('55667788990', 'Can', 'Akar', 'can.akar@example.com', '05325678901', 'erkek', '1990-03-22', 'Diyarbakır, Sur, Lalebey Mahallesi, Gazi Caddesi No:67', 'standart', '2024-02-05', 'odendi', '0-', 'Avukat', NULL)
ON CONFLICT (tc_kimlik_no) DO NOTHING;

-- =============================================
-- BENEFICIARIES (İhtiyaç Sahipleri) - 20 records
-- =============================================
INSERT INTO public.beneficiaries (tc_kimlik_no, ad, soyad, telefon, email, adres, il, ilce, cinsiyet, dogum_tarihi, medeni_hal, egitim_durumu, meslek, aylik_gelir, hane_buyuklugu, durum, ihtiyac_durumu, kategori, uyruk, kan_grubu, notlar) VALUES
('98765432109', 'Hatice', 'Yıldırım', '05329876543', 'hatice.yildirim@example.com', 'İstanbul, Ümraniye, Çakmak Mahallesi, Atatürk Caddesi No:12', 'İstanbul', 'Ümraniye', 'kadin', '1975-05-10', 'dul', 'İlkokul', 'Ev hanımı', 2500.00, 4, 'aktif', 'yuksek', 'yetiskin', 'Türkiye', 'A+', 'Eş vefat etti, 3 çocuk var'),
('87654321098', 'Osman', 'Ateş', '05328765432', NULL, 'Ankara, Mamak, Akdere Mahallesi, İnönü Caddesi No:45', 'Ankara', 'Mamak', 'erkek', '1968-08-20', 'evli', 'Ortaokul', 'İşsiz', 0.00, 5, 'aktif', 'acil', 'yetiskin', 'Türkiye', 'B+', 'Kronik hastalık var'),
('76543210987', 'Sultan', 'Güneş', '05327654321', 'sultan.gunes@example.com', 'İzmir, Bornova, Erzene Mahallesi, Ege Üniversitesi Caddesi No:78', 'İzmir', 'Bornova', 'kadin', '1980-12-15', 'evli', 'Lise', 'Temizlikçi', 3500.00, 3, 'aktif', 'orta', 'yetiskin', 'Türkiye', '0+', NULL),
('65432109876', 'İbrahim', 'Bulut', '05326543210', NULL, 'Bursa, Osmangazi, Fomara Mahallesi, Atatürk Caddesi No:23', 'Bursa', 'Osmangazi', 'erkek', '1995-03-25', 'bekar', 'Üniversite', 'Öğrenci', 0.00, 1, 'aktif', 'dusuk', 'genc', 'Türkiye', 'AB+', 'Üniversite öğrencisi'),
('54321098765', 'Nurten', 'Yıldız', '05325432109', 'nurten.yildiz@example.com', 'Antalya, Kepez, Varsak Mahallesi, Atatürk Bulvarı No:56', 'Antalya', 'Kepez', 'kadin', '1972-09-08', 'evli', 'İlkokul', 'Ev hanımı', 2000.00, 6, 'aktif', 'yuksek', 'yetiskin', 'Türkiye', 'A-', '6 çocuklu aile'),
('43210987654', 'Recep', 'Ay', '05324321098', NULL, 'Adana, Çukurova, Kurtuluş Mahallesi, Ziyapaşa Bulvarı No:34', 'Adana', 'Çukurova', 'erkek', '1985-06-30', 'evli', 'Lise', 'İşçi', 4500.00, 4, 'aktif', 'orta', 'yetiskin', 'Türkiye', 'B-', NULL),
('32109876543', 'Gülay', 'Yılmaz', '05323210987', 'gulay.yilmaz@example.com', 'Gaziantep, Şehitkamil, Karataş Mahallesi, Atatürk Caddesi No:67', 'Gaziantep', 'Şehitkamil', 'kadin', '1990-01-18', 'bekar', 'Üniversite', 'Öğretmen', 5500.00, 2, 'aktif', 'dusuk', 'genc', 'Türkiye', '0-', 'Annesi ile yaşıyor'),
('21098765432', 'Cemal', 'Kara', '05322109876', NULL, 'Kocaeli, Gebze, Cumhuriyet Mahallesi, İnönü Caddesi No:89', 'Kocaeli', 'Gebze', 'erkek', '1978-04-12', 'evli', 'Ortaokul', 'İşçi', 4000.00, 3, 'aktif', 'orta', 'yetiskin', 'Türkiye', 'AB-', NULL),
('10987654321', 'Aysel', 'Beyaz', '05321098765', 'aysel.beyaz@example.com', 'Trabzon, Akçaabat, Çarşı Mahallesi, Uzun Sokak No:12', 'Trabzon', 'Akçaabat', 'kadin', '1983-07-22', 'evli', 'Lise', 'Ev hanımı', 3000.00, 5, 'aktif', 'yuksek', 'yetiskin', 'Türkiye', 'A+', NULL),
('99887766554', 'Yusuf', 'Yeşil', '05329988776', NULL, 'Eskişehir, Odunpazarı, Arifiye Mahallesi, İnönü Caddesi No:45', 'Eskişehir', 'Odunpazarı', 'erkek', '1992-11-05', 'bekar', 'Üniversite', 'İşsiz', 0.00, 1, 'beklemede', 'acil', 'genc', 'Türkiye', 'B+', 'İş arıyor'),
('88776655443', 'Serpil', 'Mor', '05328877665', 'serpil.mor@example.com', 'Samsun, Atakum, Fener Mahallesi, Atatürk Bulvarı No:78', 'Samsun', 'Atakum', 'kadin', '1976-02-28', 'dul', 'İlkokul', 'Temizlikçi', 2500.00, 3, 'aktif', 'yuksek', 'yetiskin', 'Türkiye', '0+', '2 çocuk var'),
('77665544332', 'Kemal', 'Turuncu', '05327766554', NULL, 'Mersin, Mezitli, Çiftçiler Mahallesi, Adnan Menderes Bulvarı No:23', 'Mersin', 'Mezitli', 'erkek', '1987-10-15', 'evli', 'Lise', 'İşçi', 4200.00, 4, 'aktif', 'orta', 'yetiskin', 'Türkiye', 'A-', NULL),
('66554433221', 'Nazlı', 'Pembe', '05326655443', 'nazli.pembe@example.com', 'Kayseri, Talas, Hunat Mahallesi, Talas Caddesi No:56', 'Kayseri', 'Talas', 'kadin', '1993-05-20', 'bekar', 'Üniversite', 'Hemşire', 6000.00, 1, 'aktif', 'dusuk', 'genc', 'Türkiye', 'AB+', NULL),
('55443322110', 'Halil', 'Gri', '05325544332', NULL, 'Malatya, Yeşilyurt, Fırat Mahallesi, İnönü Caddesi No:34', 'Malatya', 'Yeşilyurt', 'erkek', '1970-08-08', 'evli', 'İlkokul', 'Emekli', 2500.00, 4, 'aktif', 'orta', 'yetiskin', 'Türkiye', 'B-', 'Emekli maaşı ile geçiniyor'),
('44332211009', 'Fadime', 'Lacivert', '05324433221', 'fadime.lacivert@example.com', 'Diyarbakır, Bağlar, Lalebey Mahallesi, Gazi Caddesi No:67', 'Diyarbakır', 'Bağlar', 'kadin', '1988-12-30', 'evli', 'Ortaokul', 'Ev hanımı', 3500.00, 5, 'aktif', 'yuksek', 'yetiskin', 'Türkiye', '0-', NULL),
('33221100998', 'Murat', 'Kahverengi', '05323322110', NULL, 'Şanlıurfa, Haliliye, Şanlıurfa Merkez, Atatürk Bulvarı No:12', 'Şanlıurfa', 'Haliliye', 'erkek', '1991-04-18', 'bekar', 'Lise', 'İşçi', 3800.00, 2, 'aktif', 'orta', 'genc', 'Türkiye', 'A+', 'Kardeşi ile yaşıyor'),
('22110099887', 'Sevgi', 'Turkuaz', '05322211009', 'sevgi.turkuaz@example.com', 'Van, İpekyolu, Van Merkez, Cumhuriyet Caddesi No:45', 'Van', 'İpekyolu', 'kadin', '1984-09-25', 'evli', 'Lise', 'Ev hanımı', 3000.00, 4, 'aktif', 'orta', 'yetiskin', 'Türkiye', 'B+', NULL),
('11009988776', 'Orhan', 'Bordo', '05321100998', NULL, 'Erzurum, Yakutiye, Erzurum Merkez, Atatürk Caddesi No:78', 'Erzurum', 'Yakutiye', 'erkek', '1979-06-12', 'evli', 'Ortaokul', 'İşçi', 4000.00, 3, 'aktif', 'orta', 'yetiskin', 'Türkiye', 'AB-', NULL),
('00998877665', 'Derya', 'Bej', '05320099887', 'derya.bej@example.com', 'Kastamonu, Merkez, Kastamonu Merkez, Cumhuriyet Caddesi No:23', 'Kastamonu', 'Merkez', 'kadin', '1994-01-08', 'bekar', 'Üniversite', 'Öğrenci', 0.00, 1, 'beklemede', 'dusuk', 'genc', 'Türkiye', '0+', 'Üniversite öğrencisi'),
('99887766550', 'Tuncay', 'Krem', '05329988776', NULL, 'Rize, Merkez, Rize Merkez, Atatürk Caddesi No:56', 'Rize', 'Merkez', 'erkek', '1986-07-22', 'evli', 'Lise', 'Balıkçı', 4500.00, 4, 'aktif', 'orta', 'yetiskin', 'Türkiye', 'A-', NULL)
ON CONFLICT (tc_kimlik_no) DO NOTHING;

-- =============================================
-- DONATIONS (Bağışlar) - 25 records
-- =============================================
INSERT INTO public.donations (bagisci_adi, tutar, currency, amac, odeme_yontemi, makbuz_no, tarih, aciklama, member_id, bagisci_telefon, bagisci_email, bagisci_adres) VALUES
('Ahmet Yılmaz', 500.00, 'TRY', 'genel', 'havale', 'KFD-2024-001', '2024-01-20', 'Genel bağış', (SELECT id FROM public.members WHERE tc_kimlik_no = '12345678901' LIMIT 1), '05321234567', 'ahmet.yilmaz@example.com', 'İstanbul, Kadıköy'),
('Ayşe Demir', 1000.00, 'TRY', 'egitim', 'nakit', 'KFD-2024-002', '2024-02-15', 'Eğitim bağışı', (SELECT id FROM public.members WHERE tc_kimlik_no = '23456789012' LIMIT 1), '05322345678', 'ayse.demir@example.com', 'Ankara, Çankaya'),
('Mehmet Kaya', 2000.00, 'TRY', 'saglik', 'havale', 'KFD-2024-003', '2024-01-10', 'Sağlık bağışı', (SELECT id FROM public.members WHERE tc_kimlik_no = '34567890123' LIMIT 1), '05323456789', 'mehmet.kaya@example.com', 'İzmir, Konak'),
('Anonim Bağışçı', 250.00, 'TRY', 'genel', 'nakit', 'KFD-2024-004', '2024-02-28', NULL, NULL, NULL, NULL, NULL),
('Ali Çelik', 750.00, 'TRY', 'insani-yardim', 'kredi_karti', 'KFD-2024-005', '2024-03-05', 'İnsani yardım', (SELECT id FROM public.members WHERE tc_kimlik_no = '56789012345' LIMIT 1), '05325678901', 'ali.celik@example.com', 'Antalya, Muratpaşa'),
('Zeynep Arslan', 300.00, 'TRY', 'egitim', 'nakit', 'KFD-2024-006', '2024-03-10', 'Eğitim bağışı', (SELECT id FROM public.members WHERE tc_kimlik_no = '67890123456' LIMIT 1), '05326789012', 'zeynep.arslan@example.com', 'Adana, Seyhan'),
('Mustafa Özdemir', 5000.00, 'TRY', 'genel', 'havale', 'KFD-2024-007', '2024-01-25', 'Büyük bağış', (SELECT id FROM public.members WHERE tc_kimlik_no = '78901234567' LIMIT 1), '05327890123', 'mustafa.ozdemir@example.com', 'Gaziantep, Şahinbey'),
('Elif Yıldız', 400.00, 'TRY', 'saglik', 'nakit', 'KFD-2024-008', '2024-03-15', 'Sağlık bağışı', (SELECT id FROM public.members WHERE tc_kimlik_no = '89012345678' LIMIT 1), '05328901234', 'elif.yildiz@example.com', 'Kocaeli, İzmit'),
('Hasan Koç', 600.00, 'TRY', 'genel', 'havale', 'KFD-2024-009', '2024-02-20', NULL, (SELECT id FROM public.members WHERE tc_kimlik_no = '90123456789' LIMIT 1), '05329012345', 'hasan.koc@example.com', 'Trabzon, Ortahisar'),
('Selin Aydın', 350.00, 'TRY', 'egitim', 'nakit', 'KFD-2024-010', '2024-03-20', 'Eğitim bağışı', (SELECT id FROM public.members WHERE tc_kimlik_no = '01234567890' LIMIT 1), '05320123456', 'selin.aydin@example.com', 'Eskişehir, Tepebaşı'),
('Burak Türk', 800.00, 'TRY', 'insani-yardim', 'kredi_karti', 'KFD-2024-011', '2024-02-25', 'İnsani yardım', (SELECT id FROM public.members WHERE tc_kimlik_no = '11223344556' LIMIT 1), '05321234567', 'burak.turk@example.com', 'Samsun, İlkadım'),
('Deniz Kurt', 450.00, 'TRY', 'saglik', 'havale', 'KFD-2024-012', '2024-03-01', 'Sağlık bağışı', (SELECT id FROM public.members WHERE tc_kimlik_no = '22334455667' LIMIT 1), '05322345678', 'deniz.kurt@example.com', 'Mersin, Yenişehir'),
('Emre Polat', 550.00, 'TRY', 'genel', 'nakit', 'KFD-2024-013', '2024-02-10', NULL, (SELECT id FROM public.members WHERE tc_kimlik_no = '33445566778' LIMIT 1), '05323456789', 'emre.polat@example.com', 'Kayseri, Melikgazi'),
('Gizem Erdoğan', 300.00, 'TRY', 'egitim', 'nakit', 'KFD-2024-014', '2024-03-12', 'Eğitim bağışı', (SELECT id FROM public.members WHERE tc_kimlik_no = '44556677889' LIMIT 1), '05324567890', 'gizem.erdogan@example.com', 'Malatya, Battalgazi'),
('Can Akar', 1200.00, 'TRY', 'insani-yardim', 'havale', 'KFD-2024-015', '2024-02-08', 'İnsani yardım', (SELECT id FROM public.members WHERE tc_kimlik_no = '55667788990' LIMIT 1), '05325678901', 'can.akar@example.com', 'Diyarbakır, Sur'),
('Anonim Bağışçı', 150.00, 'TRY', 'genel', 'nakit', 'KFD-2024-016', '2024-03-18', NULL, NULL, NULL, NULL, NULL),
('Kurumsal Bağış - ABC Şirketi', 10000.00, 'TRY', 'genel', 'havale', 'KFD-2024-017', '2024-01-30', 'Kurumsal bağış', NULL, '02121234567', 'info@abc-sirketi.com', 'İstanbul, Şişli'),
('Anonim Bağışçı', 200.00, 'TRY', 'saglik', 'nakit', 'KFD-2024-018', '2024-03-22', NULL, NULL, NULL, NULL, NULL),
('XYZ Vakfı', 15000.00, 'TRY', 'egitim', 'havale', 'KFD-2024-019', '2024-02-05', 'Eğitim projesi bağışı', NULL, '02129876543', 'info@xyz-vakfi.org', 'Ankara, Çankaya'),
('Anonim Bağışçı', 100.00, 'TRY', 'genel', 'nakit', 'KFD-2024-020', '2024-03-25', NULL, NULL, NULL, NULL, NULL),
('Ahmet Yılmaz', 500.00, 'TRY', 'genel', 'havale', 'KFD-2024-021', '2024-02-20', 'Aylık bağış', (SELECT id FROM public.members WHERE tc_kimlik_no = '12345678901' LIMIT 1), '05321234567', 'ahmet.yilmaz@example.com', 'İstanbul, Kadıköy'),
('Ayşe Demir', 1000.00, 'TRY', 'egitim', 'nakit', 'KFD-2024-022', '2024-03-15', 'Eğitim bağışı', (SELECT id FROM public.members WHERE tc_kimlik_no = '23456789012' LIMIT 1), '05322345678', 'ayse.demir@example.com', 'Ankara, Çankaya'),
('Mehmet Kaya', 2000.00, 'TRY', 'saglik', 'havale', 'KFD-2024-023', '2024-02-10', 'Sağlık bağışı', (SELECT id FROM public.members WHERE tc_kimlik_no = '34567890123' LIMIT 1), '05323456789', 'mehmet.kaya@example.com', 'İzmir, Konak'),
('Anonim Bağışçı', 75.00, 'TRY', 'genel', 'nakit', 'KFD-2024-024', '2024-03-28', NULL, NULL, NULL, NULL, NULL),
('Ali Çelik', 900.00, 'TRY', 'insani-yardim', 'kredi_karti', 'KFD-2024-025', '2024-03-08', 'İnsani yardım', (SELECT id FROM public.members WHERE tc_kimlik_no = '56789012345' LIMIT 1), '05325678901', 'ali.celik@example.com', 'Antalya, Muratpaşa')
ON CONFLICT DO NOTHING;

-- =============================================
-- KUMBARAS (Kumbaralar) - 8 records
-- =============================================
INSERT INTO public.kumbaras (kod, konum, durum, sorumlu_id, son_toplama_tarihi, toplam_toplanan, notlar) VALUES
('KMB-001', 'İstanbul, Kadıköy, Moda Mahallesi, Moda Caddesi No:12 - Bakkal', 'aktif', (SELECT id FROM public.members WHERE tc_kimlik_no = '12345678901' LIMIT 1), '2024-03-01', 1250.50, 'Aylık toplama yapılıyor'),
('KMB-002', 'Ankara, Çankaya, Kızılay Mahallesi, İnönü Bulvarı No:45 - Market', 'aktif', (SELECT id FROM public.members WHERE tc_kimlik_no = '23456789012' LIMIT 1), '2024-03-05', 890.25, NULL),
('KMB-003', 'İzmir, Konak, Alsancak Mahallesi, Kordon Boyu No:78 - Kafe', 'aktif', (SELECT id FROM public.members WHERE tc_kimlik_no = '34567890123' LIMIT 1), '2024-02-28', 2100.75, 'Yüksek bağış topluyor'),
('KMB-004', 'Bursa, Nilüfer, Özlüce Mahallesi, Fomara Caddesi No:23 - Eczane', 'aktif', (SELECT id FROM public.members WHERE tc_kimlik_no = '45678901234' LIMIT 1), '2024-03-10', 450.00, NULL),
('KMB-005', 'Antalya, Muratpaşa, Lara Mahallesi, Atatürk Bulvarı No:56 - Otel', 'aktif', (SELECT id FROM public.members WHERE tc_kimlik_no = '56789012345' LIMIT 1), '2024-03-15', 3200.00, 'Turistik bölge - yüksek bağış'),
('KMB-006', 'Adana, Seyhan, Kurtuluş Mahallesi, Ziyapaşa Bulvarı No:34 - Dükkan', 'pasif', (SELECT id FROM public.members WHERE tc_kimlik_no = '67890123456' LIMIT 1), '2024-02-20', 650.50, 'Geçici olarak pasif'),
('KMB-007', 'Gaziantep, Şahinbey, Karataş Mahallesi, Atatürk Caddesi No:67 - Restoran', 'aktif', (SELECT id FROM public.members WHERE tc_kimlik_no = '78901234567' LIMIT 1), '2024-03-12', 1800.25, NULL),
('KMB-008', 'Kocaeli, İzmit, Yenişehir Mahallesi, Cumhuriyet Caddesi No:89 - Market', 'toplandi', (SELECT id FROM public.members WHERE tc_kimlik_no = '89012345678' LIMIT 1), '2024-03-20', 950.00, 'Toplandı ve boşaltıldı')
ON CONFLICT (kod) DO NOTHING;

-- =============================================
-- SOCIAL AID APPLICATIONS (Yardım Başvuruları) - 12 records
-- =============================================
INSERT INTO public.social_aid_applications (basvuran_id, yardim_turu, talep_edilen_tutar, onaylanan_tutar, durum, basvuru_tarihi, degerlendirme_tarihi, gerekce, basvuran_ad, basvuran_soyad, basvuran_tc_kimlik_no, basvuran_telefon, basvuran_adres, notlar) VALUES
((SELECT id FROM public.beneficiaries WHERE tc_kimlik_no = '98765432109' LIMIT 1), 'nakdi', 5000.00, 3000.00, 'onaylandi', '2024-01-15', '2024-01-20', 'Eş vefat etti, 3 çocuk var, geçim sıkıntısı çekiyor', 'Hatice', 'Yıldırım', '98765432109', '05329876543', 'İstanbul, Ümraniye', 'Onaylandı ve ödeme yapıldı'),
((SELECT id FROM public.beneficiaries WHERE tc_kimlik_no = '87654321098' LIMIT 1), 'saglik', 10000.00, 8000.00, 'onaylandi', '2024-02-01', '2024-02-05', 'Kronik hastalık tedavisi için ilaç masrafı', 'Osman', 'Ateş', '87654321098', '05328765432', 'Ankara, Mamak', 'Sağlık yardımı onaylandı'),
((SELECT id FROM public.beneficiaries WHERE tc_kimlik_no = '76543210987' LIMIT 1), 'kira', 2000.00, 1500.00, 'onaylandi', '2024-02-10', '2024-02-15', 'Kira ödemesi için yardım talep ediyor', 'Sultan', 'Güneş', '76543210987', '05327654321', 'İzmir, Bornova', NULL),
((SELECT id FROM public.beneficiaries WHERE tc_kimlik_no = '65432109876' LIMIT 1), 'egitim', 3000.00, NULL, 'beklemede', '2024-03-01', NULL, 'Üniversite harç ücreti için yardım', 'İbrahim', 'Bulut', '65432109876', '05326543210', 'Bursa, Osmangazi', 'İnceleniyor'),
((SELECT id FROM public.beneficiaries WHERE tc_kimlik_no = '54321098765' LIMIT 1), 'nakdi', 4000.00, NULL, 'inceleniyor', '2024-03-05', NULL, '6 çocuklu aile, geçim sıkıntısı', 'Nurten', 'Yıldız', '54321098765', '05325432109', 'Antalya, Kepez', 'Değerlendirme aşamasında'),
((SELECT id FROM public.beneficiaries WHERE tc_kimlik_no = '43210987654' LIMIT 1), 'fatura', 1500.00, 1000.00, 'onaylandi', '2024-02-20', '2024-02-25', 'Elektrik ve su faturası ödemesi', 'Recep', 'Ay', '43210987654', '05324321098', 'Adana, Çukurova', NULL),
((SELECT id FROM public.beneficiaries WHERE tc_kimlik_no = '32109876543' LIMIT 1), 'egitim', 2500.00, NULL, 'beklemede', '2024-03-10', NULL, 'Kurs ücreti için yardım', 'Gülay', 'Yılmaz', '32109876543', '05323210987', 'Gaziantep, Şehitkamil', NULL),
((SELECT id FROM public.beneficiaries WHERE tc_kimlik_no = '21098765432' LIMIT 1), 'nakdi', 3000.00, 2000.00, 'onaylandi', '2024-02-15', '2024-02-18', 'Geçim yardımı', 'Cemal', 'Kara', '21098765432', '05322109876', 'Kocaeli, Gebze', NULL),
((SELECT id FROM public.beneficiaries WHERE tc_kimlik_no = '10987654321' LIMIT 1), 'kira', 1800.00, NULL, 'beklemede', '2024-03-12', NULL, 'Kira ödemesi', 'Aysel', 'Beyaz', '10987654321', '05321098765', 'Trabzon, Akçaabat', NULL),
((SELECT id FROM public.beneficiaries WHERE tc_kimlik_no = '99887766554' LIMIT 1), 'egitim', 2000.00, NULL, 'reddedildi', '2024-02-28', '2024-03-05', 'Eğitim yardımı', 'Yusuf', 'Yeşil', '99887766554', '05329988776', 'Eskişehir, Odunpazarı', 'Kriterlere uymuyor'),
((SELECT id FROM public.beneficiaries WHERE tc_kimlik_no = '88776655443' LIMIT 1), 'nakdi', 3500.00, 2500.00, 'onaylandi', '2024-02-25', '2024-03-01', 'Dul anne, 2 çocuk var', 'Serpil', 'Mor', '88776655443', '05328877665', 'Samsun, Atakum', NULL),
((SELECT id FROM public.beneficiaries WHERE tc_kimlik_no = '77665544332' LIMIT 1), 'fatura', 1200.00, NULL, 'inceleniyor', '2024-03-18', NULL, 'Fatura ödemesi', 'Kemal', 'Turuncu', '77665544332', '05327766554', 'Mersin, Mezitli', 'İnceleniyor')
ON CONFLICT DO NOTHING;

-- =============================================
-- PAYMENTS (Ödemeler) - 8 records
-- =============================================
INSERT INTO public.payments (application_id, beneficiary_id, tutar, odeme_tarihi, odeme_yontemi, durum, makbuz_no, notlar) VALUES
((SELECT id FROM public.social_aid_applications WHERE basvuran_tc_kimlik_no = '98765432109' AND durum = 'onaylandi' LIMIT 1), (SELECT id FROM public.beneficiaries WHERE tc_kimlik_no = '98765432109' LIMIT 1), 3000.00, '2024-01-22', 'havale', 'odendi', 'MAK-2024-001', 'Ödeme yapıldı'),
((SELECT id FROM public.social_aid_applications WHERE basvuran_tc_kimlik_no = '87654321098' AND durum = 'onaylandi' LIMIT 1), (SELECT id FROM public.beneficiaries WHERE tc_kimlik_no = '87654321098' LIMIT 1), 8000.00, '2024-02-07', 'havale', 'odendi', 'MAK-2024-002', 'Sağlık yardımı ödemesi'),
((SELECT id FROM public.social_aid_applications WHERE basvuran_tc_kimlik_no = '76543210987' AND durum = 'onaylandi' LIMIT 1), (SELECT id FROM public.beneficiaries WHERE tc_kimlik_no = '76543210987' LIMIT 1), 1500.00, '2024-02-17', 'nakit', 'odendi', 'MAK-2024-003', NULL),
((SELECT id FROM public.social_aid_applications WHERE basvuran_tc_kimlik_no = '43210987654' AND durum = 'onaylandi' LIMIT 1), (SELECT id FROM public.beneficiaries WHERE tc_kimlik_no = '43210987654' LIMIT 1), 1000.00, '2024-02-27', 'nakit', 'odendi', 'MAK-2024-004', 'Fatura ödemesi'),
((SELECT id FROM public.social_aid_applications WHERE basvuran_tc_kimlik_no = '21098765432' AND durum = 'onaylandi' LIMIT 1), (SELECT id FROM public.beneficiaries WHERE tc_kimlik_no = '21098765432' LIMIT 1), 2000.00, '2024-02-20', 'havale', 'odendi', 'MAK-2024-005', NULL),
((SELECT id FROM public.social_aid_applications WHERE basvuran_tc_kimlik_no = '88776655443' AND durum = 'onaylandi' LIMIT 1), (SELECT id FROM public.beneficiaries WHERE tc_kimlik_no = '88776655443' LIMIT 1), 2500.00, '2024-03-03', 'nakit', 'odendi', 'MAK-2024-006', NULL),
((SELECT id FROM public.social_aid_applications WHERE basvuran_tc_kimlik_no = '65432109876' AND durum = 'beklemede' LIMIT 1), (SELECT id FROM public.beneficiaries WHERE tc_kimlik_no = '65432109876' LIMIT 1), 3000.00, '2024-03-25', 'havale', 'beklemede', NULL, 'Onay bekliyor'),
((SELECT id FROM public.social_aid_applications WHERE basvuran_tc_kimlik_no = '54321098765' AND durum = 'inceleniyor' LIMIT 1), (SELECT id FROM public.beneficiaries WHERE tc_kimlik_no = '54321098765' LIMIT 1), 4000.00, '2024-03-30', 'havale', 'beklemede', NULL, 'İnceleme aşamasında')
ON CONFLICT DO NOTHING;

-- =============================================
-- DOCUMENTS (Dokümanlar) - 10 records
-- =============================================
-- Note: These are metadata records. Actual files should be uploaded to Supabase Storage.
INSERT INTO public.documents (beneficiary_id, file_name, file_path, file_type, file_size, document_type, uploaded_by, mime_type, is_verified, description) VALUES
((SELECT id FROM public.beneficiaries WHERE tc_kimlik_no = '98765432109' LIMIT 1), 'kimlik_fotokopisi.pdf', 'documents/beneficiaries/98765432109/kimlik_fotokopisi.pdf', 'application/pdf', 245760, 'kimlik', NULL, 'application/pdf', true, 'TC Kimlik fotokopisi'),
((SELECT id FROM public.beneficiaries WHERE tc_kimlik_no = '98765432109' LIMIT 1), 'gelir_belgesi.pdf', 'documents/beneficiaries/98765432109/gelir_belgesi.pdf', 'application/pdf', 189440, 'gelir', NULL, 'application/pdf', true, 'Gelir belgesi'),
((SELECT id FROM public.beneficiaries WHERE tc_kimlik_no = '87654321098' LIMIT 1), 'kimlik.jpg', 'documents/beneficiaries/87654321098/kimlik.jpg', 'image/jpeg', 156789, 'kimlik', NULL, 'image/jpeg', true, 'TC Kimlik fotoğrafı'),
((SELECT id FROM public.beneficiaries WHERE tc_kimlik_no = '87654321098' LIMIT 1), 'saglik_raporu.pdf', 'documents/beneficiaries/87654321098/saglik_raporu.pdf', 'application/pdf', 312456, 'saglik', NULL, 'application/pdf', true, 'Sağlık raporu'),
((SELECT id FROM public.beneficiaries WHERE tc_kimlik_no = '76543210987' LIMIT 1), 'ikametgah.pdf', 'documents/beneficiaries/76543210987/ikametgah.pdf', 'application/pdf', 98765, 'ikamet', NULL, 'application/pdf', false, 'İkametgah belgesi'),
((SELECT id FROM public.beneficiaries WHERE tc_kimlik_no = '54321098765' LIMIT 1), 'kimlik_fotokopisi.pdf', 'documents/beneficiaries/54321098765/kimlik_fotokopisi.pdf', 'application/pdf', 234567, 'kimlik', NULL, 'application/pdf', true, 'TC Kimlik fotokopisi'),
((SELECT id FROM public.beneficiaries WHERE tc_kimlik_no = '43210987654' LIMIT 1), 'fatura_fotokopisi.jpg', 'documents/beneficiaries/43210987654/fatura_fotokopisi.jpg', 'image/jpeg', 123456, 'diger', NULL, 'image/jpeg', true, 'Fatura fotokopisi'),
((SELECT id FROM public.beneficiaries WHERE tc_kimlik_no = '32109876543' LIMIT 1), 'kimlik.pdf', 'documents/beneficiaries/32109876543/kimlik.pdf', 'application/pdf', 198765, 'kimlik', NULL, 'application/pdf', false, 'TC Kimlik belgesi'),
((SELECT id FROM public.beneficiaries WHERE tc_kimlik_no = '21098765432' LIMIT 1), 'gelir_belgesi.pdf', 'documents/beneficiaries/21098765432/gelir_belgesi.pdf', 'application/pdf', 145678, 'gelir', NULL, 'application/pdf', true, 'Gelir belgesi'),
((SELECT id FROM public.beneficiaries WHERE tc_kimlik_no = '88776655443' LIMIT 1), 'kimlik_fotokopisi.pdf', 'documents/beneficiaries/88776655443/kimlik_fotokopisi.pdf', 'application/pdf', 267890, 'kimlik', NULL, 'application/pdf', true, 'TC Kimlik fotokopisi')
ON CONFLICT DO NOTHING;

-- =============================================
-- COMMENTS
-- =============================================
COMMENT ON TABLE public.members IS 'Üyeler tablosu - seed data ile 15 kayıt eklendi';
COMMENT ON TABLE public.beneficiaries IS 'İhtiyaç sahipleri tablosu - seed data ile 20 kayıt eklendi';
COMMENT ON TABLE public.donations IS 'Bağışlar tablosu - seed data ile 25 kayıt eklendi';
COMMENT ON TABLE public.kumbaras IS 'Kumbaralar tablosu - seed data ile 8 kayıt eklendi';
COMMENT ON TABLE public.social_aid_applications IS 'Sosyal yardım başvuruları - seed data ile 12 kayıt eklendi';
COMMENT ON TABLE public.payments IS 'Ödemeler tablosu - seed data ile 8 kayıt eklendi';
COMMENT ON TABLE public.documents IS 'Dokümanlar tablosu - seed data ile 10 kayıt eklendi (metadata only)';
