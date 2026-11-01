// =========================================================================
// WTL Assignment 4: Web-based Application using TypeScript
// Client-side User Interaction & Dynamic Data Analytics Display
// =========================================================================

// 1. Interfaces & Types Definition
export type Department = 'Computer' | 'IT' | 'AI&DS' | 'ENTC';

export enum GradeLetter {
    O = 'O (Outstanding)',
    A_PLUS = 'A+ (Excellent)',
    A = 'A (Very Good)',
    B_PLUS = 'B+ (Good)',
    B = 'B (Above Average)',
    PASS = 'P (Pass)',
    FAIL = 'F (Fail)'
}

export interface SubjectMarks {
    wtl: number;       // Web Technology Lab
    toc: number;       // Theory of Computation
    cyber: number;     // Cyber Security
    amlis: number;     // AMLIS
}

export interface StudentRecord {
    id: string;
    prn: string;
    fullName: string;
    department: Department;
    semester: number;
    marks: SubjectMarks;
    totalMarks: number;
    percentage: number;
    sgpa: number;
    grade: GradeLetter;
    status: 'Pass' | 'Fail';
    createdAt: string;
}

export interface ClassAnalytics {
    totalStudents: number;
    classAverageSgpa: number;
    highestSgpa: number;
    passPercentage: number;
    topStudentName: string;
}

// 2. Business Logic Class
export class StudentManager {
    private students: StudentRecord[] = [];
    private readonly storageKey: string = 'wtl_ts_student_records';

    constructor() {
        this.loadFromStorage();
    }

    private loadFromStorage(): void {
        const data = localStorage.getItem(this.storageKey);
        if (data) {
            try {
                this.students = JSON.parse(data);
            } catch (err) {
                console.error('Failed to parse stored students', err);
                this.students = [];
            }
        } else {
            // Seed initial records for demonstration
            this.seedInitialData();
        }
    }

    private seedInitialData(): void {
        this.addStudent({
            prn: '2024CS01',
            fullName: 'Gaurav Rajput',
            department: 'Computer',
            semester: 5,
            marks: { wtl: 92, toc: 88, cyber: 85, amlis: 90 }
        });
        this.addStudent({
            prn: '2024CS02',
            fullName: 'Aditya Patil',
            department: 'Computer',
            semester: 5,
            marks: { wtl: 78, toc: 82, cyber: 74, amlis: 80 }
        });
        this.addStudent({
            prn: '2024IT05',
            fullName: 'Snehal Joshi',
            department: 'IT',
            semester: 5,
            marks: { wtl: 88, toc: 91, cyber: 90, amlis: 94 }
        });
    }

    private saveToStorage(): void {
        localStorage.setItem(this.storageKey, JSON.stringify(this.students));
    }

    public calculateGrade(percentage: number): { grade: GradeLetter; sgpa: number; status: 'Pass' | 'Fail' } {
        const sgpa = parseFloat((percentage / 9.5).toFixed(2));
        let grade: GradeLetter;
        let status: 'Pass' | 'Fail' = 'Pass';

        if (percentage >= 85) grade = GradeLetter.O;
        else if (percentage >= 75) grade = GradeLetter.A_PLUS;
        else if (percentage >= 65) grade = GradeLetter.A;
        else if (percentage >= 55) grade = GradeLetter.B_PLUS;
        else if (percentage >= 50) grade = GradeLetter.B;
        else if (percentage >= 40) grade = GradeLetter.PASS;
        else {
            grade = GradeLetter.FAIL;
            status = 'Fail';
        }

        return { grade, sgpa, status };
    }

    public addStudent(input: { prn: string; fullName: string; department: Department; semester: number; marks: SubjectMarks }): StudentRecord {
        const totalMarks = input.marks.wtl + input.marks.toc + input.marks.cyber + input.marks.amlis;
        const percentage = parseFloat(((totalMarks / 400) * 100).toFixed(2));
        const { grade, sgpa, status } = this.calculateGrade(percentage);

        const newRecord: StudentRecord = {
            id: 'STU-' + Date.now().toString(),
            prn: input.prn.trim().toUpperCase(),
            fullName: input.fullName.trim(),
            department: input.department,
            semester: input.semester,
            marks: input.marks,
            totalMarks,
            percentage,
            sgpa,
            grade,
            status,
            createdAt: new Date().toLocaleDateString()
        };

        this.students.unshift(newRecord);
        this.saveToStorage();
        return newRecord;
    }

    public deleteStudent(id: string): boolean {
        const initialLength = this.students.length;
        this.students = this.students.filter(s => s.id !== id);
        if (this.students.length !== initialLength) {
            this.saveToStorage();
            return true;
        }
        return false;
    }

    public getAllStudents(): StudentRecord[] {
        return [...this.students];
    }

    public filterStudents(department: string, searchQuery: string): StudentRecord[] {
        return this.students.filter(student => {
            const matchesDept = !department || department === 'All' || student.department === department;
            const matchesQuery = !searchQuery || 
                student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                student.prn.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesDept && matchesQuery;
        });
    }

    public getAnalytics(): ClassAnalytics {
        if (this.students.length === 0) {
            return {
                totalStudents: 0,
                classAverageSgpa: 0,
                highestSgpa: 0,
                passPercentage: 0,
                topStudentName: 'None'
            };
        }

        const total = this.students.length;
        const totalSgpa = this.students.reduce((sum, s) => sum + s.sgpa, 0);
        const passedCount = this.students.filter(s => s.status === 'Pass').length;

        let topStudent = this.students[0];
        for (const s of this.students) {
            if (s.sgpa > topStudent.sgpa) {
                topStudent = s;
            }
        }

        return {
            totalStudents: total,
            classAverageSgpa: parseFloat((totalSgpa / total).toFixed(2)),
            highestSgpa: topStudent.sgpa,
            passPercentage: parseFloat(((passedCount / total) * 100).toFixed(1)),
            topStudentName: topStudent.fullName
        };
    }
}

// 3. UI Controller & DOM Interaction
document.addEventListener('DOMContentLoaded', () => {
    const manager = new StudentManager();

    // DOM Elements
    const form = document.getElementById('studentForm') as HTMLFormElement;
    const tableBody = document.getElementById('studentTableBody') as HTMLElement;
    const searchInput = document.getElementById('searchInput') as HTMLInputElement;
    const filterDept = document.getElementById('filterDept') as HTMLSelectElement;

    // Analytics elements
    const statTotal = document.getElementById('statTotal') as HTMLElement;
    const statAvgSgpa = document.getElementById('statAvgSgpa') as HTMLElement;
    const statHighest = document.getElementById('statHighest') as HTMLElement;
    const statPassRate = document.getElementById('statPassRate') as HTMLElement;

    // Update Analytics UI
    function renderAnalytics(): void {
        const stats = manager.getAnalytics();
        if (statTotal) statTotal.textContent = stats.totalStudents.toString();
        if (statAvgSgpa) statAvgSgpa.textContent = stats.classAverageSgpa.toFixed(2);
        if (statHighest) statHighest.textContent = `${stats.highestSgpa.toFixed(2)} (${stats.topStudentName.split(' ')[0]})`;
        if (statPassRate) statPassRate.textContent = `${stats.passPercentage}%`;
    }

    // Render Table
    function renderTable(): void {
        const dept = filterDept ? filterDept.value : 'All';
        const query = searchInput ? searchInput.value.trim() : '';
        const filtered = manager.filterStudents(dept, query);

        if (!tableBody) return;

        if (filtered.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center py-4 text-muted">
                        No student records found matching the filter criteria.
                    </td>
                </tr>
            `;
            renderAnalytics();
            return;
        }

        tableBody.innerHTML = filtered.map(student => `
            <tr>
                <td class="fw-bold">${student.prn}</td>
                <td>
                    <div class="fw-semibold">${escapeHtml(student.fullName)}</div>
                    <small class="text-muted">Sem ${student.semester}</small>
                </td>
                <td><span class="badge bg-primary-subtle text-primary">${student.department}</span></td>
                <td>
                    <small>WTL: ${student.marks.wtl} | TOC: ${student.marks.toc}<br>Cyber: ${student.marks.cyber} | AMLIS: ${student.marks.amlis}</small>
                </td>
                <td class="fw-bold">${student.percentage}%</td>
                <td class="text-primary fw-bold">${student.sgpa}</td>
                <td>
                    <span class="badge ${student.status === 'Pass' ? 'bg-success' : 'bg-danger'}">
                        ${student.status}
                    </span>
                    <small class="d-block text-muted">${student.grade}</small>
                </td>
                <td>
                    <button class="btn btn-sm btn-outline-danger btn-delete" data-id="${student.id}" title="Delete Record">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        // Attach event listeners to delete buttons
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.currentTarget as HTMLElement;
                const id = target.getAttribute('data-id');
                if (id && confirm('Are you sure you want to delete this student record?')) {
                    manager.deleteStudent(id);
                    renderTable();
                }
            });
        });

        renderAnalytics();
    }

    function escapeHtml(str: string): string {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // Form Submit Event Handler
    if (form) {
        form.addEventListener('submit', (e: Event) => {
            e.preventDefault();

            const prnInput = document.getElementById('prn') as HTMLInputElement;
            const nameInput = document.getElementById('fullName') as HTMLInputElement;
            const deptInput = document.getElementById('department') as HTMLSelectElement;
            const semInput = document.getElementById('semester') as HTMLInputElement;

            const wtlInput = document.getElementById('markWTL') as HTMLInputElement;
            const tocInput = document.getElementById('markTOC') as HTMLInputElement;
            const cyberInput = document.getElementById('markCyber') as HTMLInputElement;
            const amlisInput = document.getElementById('markAMLIS') as HTMLInputElement;

            const newStudent = {
                prn: prnInput.value,
                fullName: nameInput.value,
                department: deptInput.value as Department,
                semester: parseInt(semInput.value) || 5,
                marks: {
                    wtl: Math.min(100, Math.max(0, parseFloat(wtlInput.value) || 0)),
                    toc: Math.min(100, Math.max(0, parseFloat(tocInput.value) || 0)),
                    cyber: Math.min(100, Math.max(0, parseFloat(cyberInput.value) || 0)),
                    amlis: Math.min(100, Math.max(0, parseFloat(amlisInput.value) || 0))
                }
            };

            manager.addStudent(newStudent);
            form.reset();
            renderTable();

            const toast = document.getElementById('successToast');
            if (toast) {
                toast.classList.remove('d-none');
                setTimeout(() => toast.classList.add('d-none'), 3500);
            }
        });
    }

    if (searchInput) searchInput.addEventListener('input', renderTable);
    if (filterDept) filterDept.addEventListener('change', renderTable);

    // Initial render
    renderTable();
});
